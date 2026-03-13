from sqlmodel import Session

from app.models.session import SessionRecord
from app.repositories.session_repository import add_session_message, count_session_records, get_session_record, list_session_messages, list_session_records, save_session
from app.schemas.session import SessionCreateRequest, SessionDetailBody, SessionDetailResponse, SessionListItem, SessionListResponse, SessionMessageItem


def create_session_record(session: Session, payload: SessionCreateRequest) -> SessionRecord:
    record = SessionRecord(**payload.model_dump())
    return save_session(session, record)



def list_sessions(session: Session, page: int, page_size: int) -> SessionListResponse:
    offset = max(page - 1, 0) * page_size
    rows = list_session_records(session, offset, page_size)
    return SessionListResponse(
        items=[SessionListItem.model_validate(r) for r in rows],
        total=count_session_records(session),
        page=page,
        page_size=page_size,
    )



def get_session_detail(session: Session, session_id: str):
    record = get_session_record(session, session_id)
    if record is None:
        return None
    messages = list_session_messages(session, session_id)
    return SessionDetailResponse(
        session=SessionDetailBody.model_validate(record),
        messages=[SessionMessageItem.model_validate(m) for m in messages],
        logs=[],
    )
