from time import perf_counter
import httpx

from app.services.providers.base import BaseProviderAdapter, ProviderResponse


class OllamaAdapter(BaseProviderAdapter):
    provider_key = 'ollama'

    async def generate(self, messages):
        start = perf_counter()
        prompt = '\n'.join([f"{m['role'].upper()}: {m['content']}" for m in messages])
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                (self.base_url or 'http://localhost:11434') + '/api/generate',
                json={'model': self.model_name, 'prompt': prompt, 'stream': False, 'options': {'num_predict': self.max_tokens}},
            )
            response.raise_for_status()
            data = response.json()
        return ProviderResponse(text=data.get('response', ''), latency_ms=int((perf_counter() - start) * 1000), raw=data)
