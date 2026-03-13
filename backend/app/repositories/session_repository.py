from datetime import datetime
from typing import List, Optional
from sqlmodel import Session, select

from app.models.session import SessionRecord
from app.models.session_message import SessionMessageRecord


def save_session(session: Session, record: SessionRecord) -> SessionRecord:
    record.updated_at = datetime.utcnow()
    session.add(record)
    session.commit()
    session.refresh(record)
    return record



def get_session_record(session: Session, session_id: str) -> Optional[SessionRecord]:
    return session.get(SessionRecord, session_id)



def list_session_records(session: Session, offset: int, limit: int) -> List[SessionRecord]:
    return session.exec(select(SessionRecord).order_by(SessionRecord.created_at.desc()).offset(offset).limit(limit)).all()



def count_session_records(session: Session) -> int:
    return len(session.exec(select(SessionRecord)).all())



def add_session_message(session: Session, message: SessionMessageRecord) -> SessionMessageRecord:
    session.add(message)
    session.commit()
    session.refresh(message)
    return message



def list_session_messages(session: Session, session_id: str) -> List[SessionMessageRecord]:
    return session.exec(select(SessionMessageRecord).where(SessionMessageRecord.session_id == session_id).order_by(SessionMessageRecord.created_at)).all()
