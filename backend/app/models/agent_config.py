from datetime import datetime
from sqlmodel import SQLModel, Field
import uuid


class AgentConfigRecord(SQLModel, table=True):
    __tablename__ = 'agent_configs'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    agent_name: str = Field(index=True)
    mode_group: str = Field(index=True)
    role_label: str
    persona_description: str
    system_prompt: str
    provider_key: str
    model_name: str
    max_tokens: int = 1200
    sort_order: int = 0
    is_enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
