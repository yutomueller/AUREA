from fastapi import APIRouter, Depends
from sqlmodel import Session, text

from app.core.database import get_session
from app.schemas.settings import SystemStatusResponse
from app.services.settings.config_store import get_ui_preferences
from app.repositories.provider_repository import list_provider_configs

router = APIRouter(tags=["health"])


@router.get('/health')
def health() -> dict:
    return {"status": "ok"}


@router.get('/system/status', response_model=SystemStatusResponse)
def system_status(session: Session = Depends(get_session)) -> SystemStatusResponse:
    session.exec(text('SELECT 1'))
    prefs = get_ui_preferences(session)
    providers = list_provider_configs(session)
    return SystemStatusResponse(
        database={"status": "ok"},
        ui_language=prefs.ui_language,
        response_language=prefs.response_language,
        providers=[
            {
                "provider_key": p.provider_key,
                "enabled": p.is_enabled,
                "last_test_result": p.last_test_result,
            }
            for p in providers
        ],
    )
