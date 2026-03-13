from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class SessionRecord(SQLModel, table=True):
    __tablename__ = 'sessions'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: Optional[str] = None
    user_query: str
    agent_mode: str
    decision_mode: str
    consensus_rule: str
    status: str = 'CREATED'
    final_result: Optional[str] = None
    final_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
