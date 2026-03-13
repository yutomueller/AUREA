from sqlmodel import Session, select

from app.models.provider_config import ProviderConfigRecord

DEFAULT_PROVIDERS = [
    ('openai', 'OpenAI', 'https://api.openai.com/v1', False),
    ('anthropic', 'Anthropic', 'https://api.anthropic.com/v1', False),
    ('google', 'Google', 'https://generativelanguage.googleapis.com/v1beta/models', False),
    ('openrouter', 'OpenRouter', 'https://openrouter.ai/api/v1', False),
    ('ollama', 'Ollama', 'http://localhost:11434', True),
    ('lmstudio', 'LM Studio', 'http://localhost:1234/v1', True),
]


def ensure_default_provider_configs(session: Session) -> None:
    existing = {row.provider_key for row in session.exec(select(ProviderConfigRecord)).all()}
    created = False
    for key, name, base_url, is_local in DEFAULT_PROVIDERS:
        if key not in existing:
            session.add(ProviderConfigRecord(provider_key=key, display_name=name, base_url=base_url, is_local=is_local, is_enabled=True))
            created = True
    if created:
        session.commit()
