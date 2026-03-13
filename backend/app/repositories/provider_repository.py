from datetime import datetime
from typing import List
from sqlmodel import Session, select

from app.core.security import encrypt_value, mask_value
from app.models.provider_config import ProviderConfigRecord
from app.schemas.provider import ProviderConfigRequest
from app.services.providers.constants import SUPPORTED_PROVIDER_KEYS


def list_provider_configs(session: Session) -> List[ProviderConfigRecord]:
    return session.exec(select(ProviderConfigRecord).order_by(ProviderConfigRecord.provider_key)).all()



def save_provider_config(session: Session, payload: ProviderConfigRequest) -> ProviderConfigRecord:
    if payload.provider_key not in SUPPORTED_PROVIDER_KEYS:
        raise ValueError(f'Unsupported provider: {payload.provider_key}')

    row = session.exec(select(ProviderConfigRecord).where(ProviderConfigRecord.provider_key == payload.provider_key)).first()
    if row is None:
        row = ProviderConfigRecord(
            provider_key=payload.provider_key,
            display_name=payload.display_name,
            is_local=payload.provider_key in {'ollama', 'lmstudio'},
        )
    row.display_name = payload.display_name
    row.base_url = payload.base_url
    row.is_enabled = payload.is_enabled
    if payload.api_key is not None:
        row.api_key_encrypted = encrypt_value(payload.api_key)
        row.api_key_masked = mask_value(payload.api_key)
    row.updated_at = datetime.utcnow()
    session.add(row)
    session.commit()
    session.refresh(row)
    return row
