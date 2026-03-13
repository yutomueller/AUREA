from pathlib import Path
from typing import Generator
from sqlmodel import SQLModel, Session, create_engine

from app.core.config import get_settings

settings = get_settings()


def _prepare_sqlite_path(database_url: str) -> str:
    if not database_url.startswith('sqlite:///'):
        return database_url

    raw_path = database_url.replace('sqlite:///', '', 1)
    db_path = Path(raw_path)
    if not db_path.is_absolute():
        db_path = Path.cwd() / db_path

    db_path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{db_path.resolve()}"


normalized_database_url = _prepare_sqlite_path(settings.database_url)
connect_args = {"check_same_thread": False} if normalized_database_url.startswith('sqlite') else {}
engine = create_engine(normalized_database_url, echo=False, connect_args=connect_args)


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
