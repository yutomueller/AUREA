from datetime import datetime
from typing import List
from sqlmodel import Session, select

from app.models.agent_config import AgentConfigRecord
from app.schemas.agent import AgentConfigItem


def get_agent_configs_by_mode(session: Session, mode: str) -> List[AgentConfigItem]:
    rows = session.exec(select(AgentConfigRecord).where(AgentConfigRecord.mode_group == mode).order_by(AgentConfigRecord.sort_order)).all()
    return [AgentConfigItem.model_validate(row) for row in rows]



def upsert_agent_configs(session: Session, mode_group: str, items: List[AgentConfigItem]) -> None:
    existing = {row.agent_name: row for row in session.exec(select(AgentConfigRecord).where(AgentConfigRecord.mode_group == mode_group)).all()}
    for item in items:
        row = existing.get(item.agent_name)
        if row:
            row.role_label = item.role_label
            row.persona_description = item.persona_description
            row.system_prompt = item.system_prompt
            row.provider_key = item.provider_key
            row.model_name = item.model_name
            row.max_tokens = item.max_tokens
            row.sort_order = item.sort_order
            row.is_enabled = item.is_enabled
            row.updated_at = datetime.utcnow()
            session.add(row)
        else:
            session.add(AgentConfigRecord(**item.model_dump(), mode_group=mode_group))
    session.commit()
