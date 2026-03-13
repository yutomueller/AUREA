from time import perf_counter
import httpx

from app.services.providers.base import BaseProviderAdapter, ProviderResponse


class GoogleAdapter(BaseProviderAdapter):
    provider_key = 'google'

    async def generate(self, messages):
        start = perf_counter()
        prompt = '\n'.join([m['content'] for m in messages])
        endpoint = (self.base_url or 'https://generativelanguage.googleapis.com/v1beta/models') + f'/{self.model_name}:generateContent?key={self.api_key}'
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(endpoint, json={'contents': [{'parts': [{'text': prompt}]}]})
            response.raise_for_status()
            data = response.json()
        text = data['candidates'][0]['content']['parts'][0]['text']
        return ProviderResponse(text=text, latency_ms=int((perf_counter() - start) * 1000), raw=data)
