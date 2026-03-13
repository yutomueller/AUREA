from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.session import SessionDetailResponse, SessionListResponse
from app.services.history.session_store import list_sessions, get_session_detail

router = APIRouter(tags=["history"])


@router.get('/history', response_model=SessionListResponse)
def history_list(page: int = 1, page_size: int = 20, session: Session = Depends(get_session)):
    return list_sessions(session, page=page, page_size=page_size)


@router.get('/history/{session_id}', response_model=SessionDetailResponse)
def history_detail(session_id: str, session: Session = Depends(get_session)):
    detail = get_session_detail(session, session_id)
    if not detail:
        raise HTTPException(status_code=404, detail='Session not found')
    return detail
