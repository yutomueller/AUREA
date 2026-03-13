from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class SessionMessageRecord(SQLModel, table=True):
    __tablename__ = 'session_messages'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: str = Field(index=True)
    round_no: int = 1
    phase: str
    agent_name: str
    message_type: str
    content: str
    vote: Optional[str] = None
    confidence: Optional[float] = None
    latency_ms: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
