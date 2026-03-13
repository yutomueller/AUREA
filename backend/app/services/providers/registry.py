from sqlmodel import Session

from app.core.security import decrypt_value
from app.models.provider_config import ProviderConfigRecord
from app.schemas.provider import ProviderTestRequest
from app.services.providers.openai_adapter import OpenAIAdapter
from app.services.providers.openrouter_adapter import OpenRouterAdapter
from app.services.providers.ollama_adapter import OllamaAdapter
from app.services.providers.lmstudio_adapter import LMStudioAdapter
from app.services.providers.anthropic_adapter import AnthropicAdapter
from app.services.providers.google_adapter import GoogleAdapter


PROVIDER_MAP = {
    'openai': OpenAIAdapter,
    'openrouter': OpenRouterAdapter,
    'ollama': OllamaAdapter,
    'lmstudio': LMStudioAdapter,
    'anthropic': AnthropicAdapter,
    'google': GoogleAdapter,
}


def build_provider(provider_key: str, model_name: str, api_key: str | None, base_url: str | None, max_tokens: int):
    cls = PROVIDER_MAP[provider_key]
    return cls(model_name=model_name, api_key=api_key, base_url=base_url, max_tokens=max_tokens)


def build_provider_from_record(record: ProviderConfigRecord, model_name: str, max_tokens: int):
    return build_provider(record.provider_key, model_name, decrypt_value(record.api_key_encrypted or ''), record.base_url, max_tokens)


def build_provider_from_request(payload: ProviderTestRequest):
    default_model = {
        'openai': 'gpt-4o-mini',
        'openrouter': 'openai/gpt-4o-mini',
        'ollama': 'llama3.2',
        'lmstudio': 'local-model',
        'anthropic': 'claude-3-5-sonnet-latest',
        'google': 'gemini-2.0-flash',
    }.get(payload.provider_key, 'gpt-4o-mini')
    return build_provider(payload.provider_key, default_model, payload.api_key, payload.base_url, 128)
