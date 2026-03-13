from typing import Any, List, Dict
from pydantic import BaseModel, ConfigDict


class UiPreferenceRequest(BaseModel):
    theme_name: str = 'aurea'
    animation_level: str = 'MEDIUM'
    sound_enabled: bool = False
    density: str = 'NORMAL'
    ui_language: str = 'ja'
    response_language: str = 'ja'


class UiPreferenceResponse(UiPreferenceRequest):
    model_config = ConfigDict(from_attributes=True)


class SystemStatusResponse(BaseModel):
    database: Dict[str, Any]
    ui_language: str
    response_language: str
    providers: List[Dict[str, Any]]
