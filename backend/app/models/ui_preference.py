from datetime import datetime
from sqlmodel import SQLModel, Field
import uuid


class UiPreferenceRecord(SQLModel, table=True):
    __tablename__ = 'ui_preferences'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    theme_name: str = 'aurea'
    animation_level: str = 'MEDIUM'
    sound_enabled: bool = False
    density: str = 'NORMAL'
    ui_language: str = 'ja'
    response_language: str = 'ja'
    request_timeout_seconds: int = 60
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
