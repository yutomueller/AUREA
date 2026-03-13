from typing import List
from pydantic import BaseModel, Field, ConfigDict


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AgentConfigItem(ORMBase):
    agent_name: str
    role_label: str
    persona_description: str
    system_prompt: str
    provider_key: str
    model_name: str
    max_tokens: int = Field(1200, ge=64, le=16000)
    sort_order: int = 0
    is_enabled: bool = True


class AgentConfigBundle(BaseModel):
    mode: str
    items: List[AgentConfigItem]


class AgentConfigUpdateRequest(BaseModel):
    mode_group: str
    items: List[AgentConfigItem]
