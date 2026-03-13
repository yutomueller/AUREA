from typing import AsyncIterator
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.session import (
    SessionCreateRequest,
    SessionCreateResponse,
    SessionRunRequest,
    SessionRunResponse,
    SessionListResponse,
    SessionDetailResponse,
)
from app.services.history.session_store import (
    create_session_record,
    get_session_detail,
    list_sessions,
)
from app.services.orchestration.graph import run_aurea_session, stream_aurea_session

router = APIRouter(tags=["sessions"])


@router.post('/sessions', response_model=SessionCreateResponse)
def create_session(payload: SessionCreateRequest, session: Session = Depends(get_session)) -> SessionCreateResponse:
    record = create_session_record(session, payload)
    return SessionCreateResponse(id=record.id, status=record.status, created_at=record.created_at)


@router.post('/sessions/{session_id}/run')
async def run_session(session_id: str, payload: SessionRunRequest, session: Session = Depends(get_session)):
    detail = get_session_detail(session, session_id)
    if not detail:
        raise HTTPException(status_code=404, detail='Session not found')
    if payload.stream:
        async def event_stream() -> AsyncIterator[str]:
            async for chunk in stream_aurea_session(session, session_id):
                yield f"data: {chunk}\n\n"
        return StreamingResponse(event_stream(), media_type='text/event-stream')
    return await run_aurea_session(session, session_id)


@router.get('/sessions', response_model=SessionListResponse)
def get_sessions(page: int = 1, page_size: int = 20, session: Session = Depends(get_session)) -> SessionListResponse:
    return list_sessions(session, page=page, page_size=page_size)


@router.get('/sessions/{session_id}', response_model=SessionDetailResponse)
def get_session(session_id: str, session: Session = Depends(get_session)) -> SessionDetailResponse:
    detail = get_session_detail(session, session_id)
    if not detail:
        raise HTTPException(status_code=404, detail='Session not found')
    return detail
