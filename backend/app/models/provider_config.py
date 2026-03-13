from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class ProviderConfigRecord(SQLModel, table=True):
    __tablename__ = 'provider_configs'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    provider_key: str = Field(index=True, unique=True)
    display_name: str
    api_key_masked: Optional[str] = None
    api_key_encrypted: Optional[str] = None
    base_url: Optional[str] = None
    is_local: bool = False
    is_enabled: bool = True
    last_test_result: str = 'UNKNOWN'
    last_error_message: Optional[str] = None
    last_tested_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
