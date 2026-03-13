from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class SessionCreateRequest(BaseModel):
    title: Optional[str] = None
    user_query: str = Field(..., min_length=1, max_length=10000)
    agent_mode: str
    decision_mode: str
    consensus_rule: str


class SessionCreateResponse(BaseModel):
    id: str
    status: str
    created_at: datetime


class SessionRunRequest(BaseModel):
    stream: bool = False


class SessionRunResponse(BaseModel):
    session_id: str
    status: str
    final_result: str
    final_summary: str
    rounds: int
    votes: Dict[str, str]


class SessionListItem(ORMBase):
    id: str
    title: Optional[str] = None
    user_query: str
    agent_mode: str
    decision_mode: str
    consensus_rule: str
    status: str
    final_result: Optional[str] = None
    created_at: datetime


class SessionListResponse(BaseModel):
    items: List[SessionListItem]
    total: int
    page: int
    page_size: int


class SessionMessageItem(ORMBase):
    id: str
    round_no: int
    phase: str
    agent_name: str
    message_type: str
    content: str
    vote: Optional[str] = None
    confidence: Optional[float] = None
    created_at: datetime


class SessionDetailBody(ORMBase):
    id: str
    title: Optional[str] = None
    user_query: str
    agent_mode: str
    decision_mode: str
    consensus_rule: str
    status: str
    final_result: Optional[str] = None
    final_summary: Optional[str] = None


class SessionDetailResponse(BaseModel):
    session: SessionDetailBody
    messages: List[SessionMessageItem]
    logs: List[dict]
