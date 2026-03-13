from sqlmodel import Session
from app.models.execution_log import ExecutionLogRecord


def add_execution_log(session: Session, log: ExecutionLogRecord) -> None:
    session.add(log)
    session.commit()
