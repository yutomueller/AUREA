from datetime import datetime

from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlmodel import Session, select

from app.models.ui_preference import UiPreferenceRecord
from app.schemas.settings import UiPreferenceRequest, UiPreferenceResponse


TIMEOUT_COLUMN = 'request_timeout_seconds'


def _ensure_timeout_column(session: Session) -> None:
    rows = session.exec(text("PRAGMA table_info('ui_preferences')")).all()
    col_names = {row[1] for row in rows if len(row) > 1}
    if TIMEOUT_COLUMN not in col_names:
        session.exec(text(f"ALTER TABLE ui_preferences ADD COLUMN {TIMEOUT_COLUMN} INTEGER DEFAULT 60"))
        session.commit()


def _load_first_pref_row(session: Session) -> UiPreferenceRecord | None:
    try:
        return session.exec(select(UiPreferenceRecord)).first()
    except OperationalError as exc:
        if TIMEOUT_COLUMN in str(exc):
            _ensure_timeout_column(session)
            return session.exec(select(UiPreferenceRecord)).first()
        raise


def get_ui_preferences(session: Session) -> UiPreferenceResponse:
    row = _load_first_pref_row(session)
    if row is None:
        row = UiPreferenceRecord()
        session.add(row)
        session.commit()
        session.refresh(row)
    return UiPreferenceResponse.model_validate(row)


def save_ui_preferences(session: Session, payload: UiPreferenceRequest) -> UiPreferenceResponse:
    row = _load_first_pref_row(session)
    if row is None:
        row = UiPreferenceRecord(**payload.model_dump())
    else:
        for key, value in payload.model_dump().items():
            setattr(row, key, value)
        row.updated_at = datetime.utcnow()
    session.add(row)
    session.commit()
    session.refresh(row)
    return UiPreferenceResponse.model_validate(row)
