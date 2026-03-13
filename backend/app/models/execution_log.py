from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class ExecutionLogRecord(SQLModel, table=True):
    __tablename__ = 'execution_logs'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: Optional[str] = Field(default=None, index=True)
    agent_name: Optional[str] = None
    provider_key: Optional[str] = None
    model_name: Optional[str] = None
    event_type: str
    message: str
    duration_ms: Optional[int] = None
    http_status: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
