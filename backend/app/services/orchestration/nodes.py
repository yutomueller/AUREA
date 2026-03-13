import asyncio
from datetime import datetime
from typing import Dict, List

from sqlmodel import Session

from app.models.session_message import SessionMessageRecord
from app.repositories.agent_repository import get_agent_configs_by_mode
from app.repositories.provider_repository import list_provider_configs
from app.repositories.session_repository import add_session_message, get_session_record, save_session
from app.services.agents.prompt_builder import build_independent_prompt, build_debate_prompt
from app.services.orchestration.debate import summarize_opposition
from app.services.orchestration.parser import parse_independent_output, parse_debate_output
from app.services.orchestration.voting import resolve_final_result, split_majority_minority
from app.services.providers.registry import build_provider
from app.services.settings.config_store import get_ui_preferences


async def _call_agent(provider, system_prompt: str, user_prompt: str):
    return await provider.generate([
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': user_prompt},
    ])


def _provider_error_content(exc: Exception) -> str:
    return f"[ERROR]\nProvider call failed: {type(exc).__name__}: {exc}\n[VOTE]\nREJECT\n[CONFIDENCE]\n0"


async def run_simple(session: Session, session_id: str):
    record = get_session_record(session, session_id)
    prefs = get_ui_preferences(session)
    agent_configs = get_agent_configs_by_mode(session, record.agent_mode)
    provider_rows = {p.provider_key: p for p in list_provider_configs(session)}
    record.status = 'RUNNING'
    save_session(session, record)

    async def run_one(agent):
        try:
            provider_row = provider_rows.get(agent.provider_key)
            provider = build_provider(
                agent.provider_key,
                agent.model_name,
                __import__('app.core.security', fromlist=['decrypt_value']).decrypt_value(provider_row.api_key_encrypted or '') if provider_row else '',
                provider_row.base_url if provider_row else None,
                agent.max_tokens,
                prefs.request_timeout_seconds,
            )
            user_prompt = build_independent_prompt(agent.system_prompt, record.user_query, prefs.response_language)
            res = await _call_agent(provider, 'Follow the user prompt exactly.', user_prompt)
            parsed = parse_independent_output(res.text)
            content = res.text
            latency_ms = res.latency_ms
        except Exception as exc:
            content = _provider_error_content(exc)
            parsed = parse_independent_output(content)
            latency_ms = None

        add_session_message(
            session,
            SessionMessageRecord(
                session_id=session_id,
                round_no=1,
                phase='INDEPENDENT',
                agent_name=agent.agent_name,
                message_type='OPINION',
                content=content,
                vote=parsed['vote'],
                confidence=parsed['confidence'],
                latency_ms=latency_ms,
            ),
        )
        return agent.agent_name, parsed

    results = dict(await asyncio.gather(*[run_one(agent) for agent in agent_configs], return_exceptions=False))
    votes = {k: v['vote'] for k, v in results.items()}
    final_result = resolve_final_result(votes, record.agent_mode, record.consensus_rule)
    record.status = 'COMPLETED'
    record.final_result = final_result
    record.completed_at = datetime.utcnow()
    record.final_summary = build_final_summary(votes, final_result, record.agent_mode, record.consensus_rule)
    save_session(session, record)
    return record, votes, 1


async def run_debate(session: Session, session_id: str):
    record, votes, _ = await run_simple(session, session_id)
    if len(set(votes.values())) == 1:
        return record, votes, 1
    record.status = 'DEBATING'
    save_session(session, record)

    prefs = get_ui_preferences(session)
    agent_configs = {a.agent_name: a for a in get_agent_configs_by_mode(session, record.agent_mode)}
    provider_rows = {p.provider_key: p for p in list_provider_configs(session)}
    latest_outputs = {
        m.agent_name: m.content
        for m in session.query(SessionMessageRecord).filter(
            SessionMessageRecord.session_id == session_id,
            SessionMessageRecord.phase == 'INDEPENDENT',
        ).all()
    }
    majority, minority = split_majority_minority(votes)
    minority_summary = summarize_opposition({name: {'summary': latest_outputs[name]} for name in minority}, minority)
    majority_summary = summarize_opposition({name: {'summary': latest_outputs[name]} for name in majority}, majority)

    async def rerun(agent_name: str, opposing_summary: str):
        agent = agent_configs[agent_name]
        try:
            provider_row = provider_rows.get(agent.provider_key)
            provider = build_provider(
                agent.provider_key,
                agent.model_name,
                __import__('app.core.security', fromlist=['decrypt_value']).decrypt_value(provider_row.api_key_encrypted or '') if provider_row else '',
                provider_row.base_url if provider_row else None,
                agent.max_tokens,
                prefs.request_timeout_seconds,
            )
            prompt = build_debate_prompt(agent.system_prompt, record.user_query, latest_outputs[agent_name], opposing_summary, prefs.response_language)
            res = await _call_agent(provider, 'Follow the user prompt exactly.', prompt)
            parsed = parse_debate_output(res.text)
            content = res.text
            latency_ms = res.latency_ms
        except Exception as exc:
            content = _provider_error_content(exc)
            parsed = parse_debate_output(content)
            latency_ms = None

        add_session_message(
            session,
            SessionMessageRecord(
                session_id=session_id,
                round_no=2,
                phase='DEBATE',
                agent_name=agent.agent_name,
                message_type='REBUTTAL',
                content=content,
                vote=parsed['vote'],
                confidence=parsed['confidence'],
                latency_ms=latency_ms,
            ),
        )
        return agent_name, parsed['vote']

    updated = dict(await asyncio.gather(*([rerun(name, majority_summary) for name in minority] + [rerun(name, minority_summary) for name in majority]), return_exceptions=False))
    final_result = resolve_final_result(updated, record.agent_mode, record.consensus_rule)
    record.status = 'COMPLETED'
    record.final_result = final_result
    record.completed_at = datetime.utcnow()
    record.final_summary = build_final_summary(updated, final_result, record.agent_mode, record.consensus_rule)
    save_session(session, record)
    return record, updated, 2



def build_final_summary(votes: Dict[str, str], final_result: str, agent_mode: str, consensus_rule: str) -> str:
    approved = [name for name, vote in votes.items() if vote == 'APPROVE']
    rejected = [name for name, vote in votes.items() if vote == 'REJECT']
    return (
        f"Final result: {final_result}. Rule: {agent_mode}/{consensus_rule}. "
        f"Approved: {', '.join(approved) if approved else 'none'}. "
        f"Rejected: {', '.join(rejected) if rejected else 'none'}."
    )
