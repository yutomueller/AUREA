from datetime import datetime
from sqlmodel import Session, select

from app.models.ui_preference import UiPreferenceRecord
from app.schemas.settings import UiPreferenceRequest, UiPreferenceResponse



def _ensure_timeout_column(session: Session) -> None:
    try:
        rows = session.exec("PRAGMA table_info('ui_preferences')").all()
    except Exception:
        return
    col_names = {row[1] for row in rows if len(row) > 1}
    if 'request_timeout_seconds' not in col_names:
        session.exec("ALTER TABLE ui_preferences ADD COLUMN request_timeout_seconds INTEGER DEFAULT 60")
        session.commit()



def get_ui_preferences(session: Session) -> UiPreferenceResponse:
    _ensure_timeout_column(session)
    row = session.exec(select(UiPreferenceRecord)).first()
    if row is None:
        row = UiPreferenceRecord()
        session.add(row)
        session.commit()
        session.refresh(row)
    return UiPreferenceResponse.model_validate(row)



def save_ui_preferences(session: Session, payload: UiPreferenceRequest) -> UiPreferenceResponse:
    _ensure_timeout_column(session)
    row = session.exec(select(UiPreferenceRecord)).first()
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
