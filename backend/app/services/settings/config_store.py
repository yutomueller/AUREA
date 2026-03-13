from datetime import datetime
from sqlmodel import Session, select

from app.models.ui_preference import UiPreferenceRecord
from app.schemas.settings import UiPreferenceRequest, UiPreferenceResponse



def get_ui_preferences(session: Session) -> UiPreferenceResponse:
    row = session.exec(select(UiPreferenceRecord)).first()
    if row is None:
        row = UiPreferenceRecord()
        session.add(row)
        session.commit()
        session.refresh(row)
    return UiPreferenceResponse.model_validate(row)



def save_ui_preferences(session: Session, payload: UiPreferenceRequest) -> UiPreferenceResponse:
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
