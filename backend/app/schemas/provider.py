from typing import Optional
from pydantic import BaseModel


class ProviderConfigRequest(BaseModel):
    provider_key: str
    display_name: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    is_enabled: bool = True


class ProviderConfigResponse(BaseModel):
    provider_key: str
    saved: bool


class ProviderTestRequest(BaseModel):
    provider_key: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None


class ProviderTestResponse(BaseModel):
    provider_key: str
    success: bool
    message: str
