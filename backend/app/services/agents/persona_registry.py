from sqlmodel import Session

from app.repositories.agent_repository import get_agent_configs_by_mode, upsert_agent_configs
from app.schemas.agent import AgentConfigItem
from app.services.providers.constants import DEFAULT_OPENROUTER_MODEL, DEFAULT_PROVIDER_KEY, SUPPORTED_PROVIDER_KEYS


DEFAULTS = {
    'THREE': [
        AgentConfigItem(agent_name='VERGILIUS', role_label='Strategy', persona_description='Order, strategic coherence, long-term structure.', system_prompt='You are VERGILIUS of AUREA. Prioritize order, strategy, long-term coherence, and structural stability.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=1),
        AgentConfigItem(agent_name='HORATIUS', role_label='Ethics', persona_description='Balance, ethics, moderation, safety.', system_prompt='You are HORATIUS of AUREA. Prioritize balance, ethics, safety, and sustainability.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=2),
        AgentConfigItem(agent_name='OVIDIUS', role_label='Intuition', persona_description='Change, creativity, intuition, aesthetic possibility.', system_prompt='You are OVIDIUS of AUREA. Prioritize creativity, change, intuition, and transformative potential.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=3),
    ],
    'FIVE': [
        AgentConfigItem(agent_name='VERGILIUS', role_label='Strategy', persona_description='Order, strategic coherence, long-term structure.', system_prompt='You are VERGILIUS of AUREA. Prioritize order, strategy, long-term coherence, and structural stability.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=1),
        AgentConfigItem(agent_name='HORATIUS', role_label='Ethics', persona_description='Balance, ethics, moderation, safety.', system_prompt='You are HORATIUS of AUREA. Prioritize balance, ethics, safety, and sustainability.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=2),
        AgentConfigItem(agent_name='OVIDIUS', role_label='Intuition', persona_description='Change, creativity, intuition, and novelty.', system_prompt='You are OVIDIUS of AUREA. Prioritize creativity, change, intuition, and transformative potential.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=3),
        AgentConfigItem(agent_name='LUCRETIUS', role_label='Analysis', persona_description='Causal analysis, skepticism, explanatory rigor.', system_prompt='You are LUCRETIUS of AUREA. Prioritize analysis, causal rigor, skepticism, and explanatory depth.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=4),
        AgentConfigItem(agent_name='CATULLUS', role_label='Emotion', persona_description='Emotion, attachment, personal significance, human desire.', system_prompt='You are CATULLUS of AUREA. Prioritize emotion, attachment, personal significance, and human desire.', provider_key=DEFAULT_PROVIDER_KEY, model_name=DEFAULT_OPENROUTER_MODEL, max_tokens=1200, sort_order=5),
    ],
}



def ensure_default_agent_configs(session: Session) -> None:
    for mode, items in DEFAULTS.items():
        existing = get_agent_configs_by_mode(session, mode)
        if not existing:
            upsert_agent_configs(session, mode, items)
            continue

        normalized: list[AgentConfigItem] = []
        updated = False
        for item in existing:
            provider_key = item.provider_key if item.provider_key in SUPPORTED_PROVIDER_KEYS else DEFAULT_PROVIDER_KEY
            model_name = item.model_name
            if provider_key == DEFAULT_PROVIDER_KEY and not model_name:
                model_name = DEFAULT_OPENROUTER_MODEL
            if provider_key != item.provider_key or model_name != item.model_name:
                updated = True
            normalized.append(item.model_copy(update={'provider_key': provider_key, 'model_name': model_name}))

        if updated:
            upsert_agent_configs(session, mode, normalized)
