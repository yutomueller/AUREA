from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.agent import AgentConfigBundle, AgentConfigUpdateRequest
from app.services.agents.persona_registry import ensure_default_agent_configs
from app.repositories.agent_repository import get_agent_configs_by_mode, upsert_agent_configs

router = APIRouter(tags=["agents"])


@router.get('/agents/config', response_model=AgentConfigBundle)
def get_agent_configs(mode: str, session: Session = Depends(get_session)) -> AgentConfigBundle:
    ensure_default_agent_configs(session)
    items = get_agent_configs_by_mode(session, mode)
    return AgentConfigBundle(mode=mode, items=items)


@router.put('/agents/config', response_model=AgentConfigBundle)
def save_agent_configs(payload: AgentConfigUpdateRequest, session: Session = Depends(get_session)) -> AgentConfigBundle:
    upsert_agent_configs(session, payload.mode_group, payload.items)
    return AgentConfigBundle(mode=payload.mode_group, items=get_agent_configs_by_mode(session, payload.mode_group))
