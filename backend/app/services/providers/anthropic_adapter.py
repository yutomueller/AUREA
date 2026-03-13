from time import perf_counter
import httpx

from app.services.providers.base import BaseProviderAdapter, ProviderResponse


class AnthropicAdapter(BaseProviderAdapter):
    provider_key = 'anthropic'

    async def generate(self, messages):
        start = perf_counter()
        system = next((m['content'] for m in messages if m['role'] == 'system'), '')
        chat = [m for m in messages if m['role'] != 'system']
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                (self.base_url or 'https://api.anthropic.com/v1') + '/messages',
                headers={'x-api-key': self.api_key, 'anthropic-version': '2023-06-01'},
                json={'model': self.model_name, 'system': system, 'max_tokens': self.max_tokens, 'messages': chat},
            )
            response.raise_for_status()
            data = response.json()
        text = ''.join([b.get('text', '') for b in data.get('content', []) if b.get('type') == 'text'])
        return ProviderResponse(text=text, latency_ms=int((perf_counter() - start) * 1000), raw=data)
