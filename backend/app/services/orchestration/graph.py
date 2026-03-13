import json
from sqlmodel import Session

from app.schemas.session import SessionRunResponse
from app.services.orchestration.nodes import run_simple, run_debate
from app.repositories.session_repository import get_session_record


async def run_aurea_session(session: Session, session_id: str) -> SessionRunResponse:
    record = get_session_record(session, session_id)
    if record is None:
        raise ValueError('Session not found')
    if record.decision_mode == 'DEBATE':
        record, votes, rounds = await run_debate(session, session_id)
    else:
        record, votes, rounds = await run_simple(session, session_id)
    return SessionRunResponse(session_id=record.id, status=record.status, final_result=record.final_result or 'REJECTED', final_summary=record.final_summary or '', rounds=rounds, votes=votes)


async def stream_aurea_session(session: Session, session_id: str):
    yield json.dumps({'event': 'session.started', 'session_id': session_id})
    result = await run_aurea_session(session, session_id)
    yield json.dumps({'event': 'session.completed', 'session_id': session_id, 'payload': result.model_dump()})
