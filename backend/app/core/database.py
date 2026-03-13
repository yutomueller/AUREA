from typing import Generator
from sqlmodel import SQLModel, Session, create_engine

from app.core.config import get_settings

settings = get_settings()
connect_args = {"check_same_thread": False} if settings.database_url.startswith('sqlite') else {}
engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)


def init_db() -> None:
    from app.models.session import SessionRecord
    from app.models.session_message import SessionMessageRecord
    from app.models.agent_config import AgentConfigRecord
    from app.models.provider_config import ProviderConfigRecord
    from app.models.execution_log import ExecutionLogRecord
    from app.models.ui_preference import UiPreferenceRecord

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
