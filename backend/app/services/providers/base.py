from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
import httpx


@dataclass
class ProviderResponse:
    text: str
    usage_input_tokens: Optional[int] = None
    usage_output_tokens: Optional[int] = None
    finish_reason: Optional[str] = None
    latency_ms: Optional[int] = None
    raw: Optional[dict] = None


class BaseProviderAdapter:
    provider_key: str = 'base'

    def __init__(self, model_name: str, api_key: str | None = None, base_url: str | None = None, max_tokens: int = 1200):
        self.model_name = model_name
        self.api_key = api_key or ''
        self.base_url = base_url or ''
        self.max_tokens = max_tokens

    async def generate(self, messages: List[Dict[str, str]]) -> ProviderResponse:
        raise NotImplementedError

    async def test_connection(self) -> Tuple[bool, str]:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                if self.base_url:
                    await client.get(self.base_url)
            return True, 'Connection successful'
        except Exception as exc:
            return False, str(exc)
