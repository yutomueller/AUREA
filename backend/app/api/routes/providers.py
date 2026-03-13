from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.provider import ProviderConfigRequest, ProviderConfigResponse, ProviderTestRequest, ProviderTestResponse
from app.repositories.provider_repository import list_provider_configs, save_provider_config
from app.services.providers.registry import build_provider_from_request
from app.services.providers.defaults import ensure_default_provider_configs

router = APIRouter(tags=["providers"])


@router.get('/providers')
def get_providers(session: Session = Depends(get_session)):
    ensure_default_provider_configs(session)
    return {"items": list_provider_configs(session)}


@router.put('/providers/config', response_model=ProviderConfigResponse)
def save_provider(payload: ProviderConfigRequest, session: Session = Depends(get_session)) -> ProviderConfigResponse:
    try:
        saved = save_provider_config(session, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return ProviderConfigResponse(provider_key=saved.provider_key, saved=True)


@router.post('/providers/test', response_model=ProviderTestResponse)
async def test_provider(payload: ProviderTestRequest) -> ProviderTestResponse:
    try:
        provider = build_provider_from_request(payload)
    except KeyError as exc:
        raise HTTPException(status_code=400, detail=f'Unsupported provider: {payload.provider_key}') from exc
    result = await provider.test_connection()
    return ProviderTestResponse(provider_key=payload.provider_key, success=result[0], message=result[1])
