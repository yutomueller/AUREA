from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.settings import UiPreferenceRequest, UiPreferenceResponse
from app.services.settings.config_store import get_ui_preferences, save_ui_preferences

router = APIRouter(tags=["settings"])


@router.get('/settings/ui', response_model=UiPreferenceResponse)
def get_settings(session: Session = Depends(get_session)) -> UiPreferenceResponse:
    return get_ui_preferences(session)


@router.put('/settings/ui', response_model=UiPreferenceResponse)
def put_settings(payload: UiPreferenceRequest, session: Session = Depends(get_session)) -> UiPreferenceResponse:
    return save_ui_preferences(session, payload)
