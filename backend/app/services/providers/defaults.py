from sqlmodel import Session, select

from app.models.provider_config import ProviderConfigRecord

DEFAULT_PROVIDERS = [
    ('openrouter', 'OpenRouter', 'https://openrouter.ai/api/v1', False),
    ('ollama', 'Ollama', 'http://localhost:11434', True),
    ('lmstudio', 'LM Studio', 'http://localhost:1234/v1', True),
]


def ensure_default_provider_configs(session: Session) -> None:
    rows = session.exec(select(ProviderConfigRecord)).all()
    existing = {row.provider_key for row in rows}
    created = False

    for key, name, base_url, is_local in DEFAULT_PROVIDERS:
        if key not in existing:
            session.add(ProviderConfigRecord(provider_key=key, display_name=name, base_url=base_url, is_local=is_local, is_enabled=True))
            created = True

    removed = False
    for row in rows:
        if row.provider_key not in {key for key, *_ in DEFAULT_PROVIDERS}:
            session.delete(row)
            removed = True

    if created or removed:
        session.commit()
