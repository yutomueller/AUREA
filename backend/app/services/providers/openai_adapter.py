from time import perf_counter
import httpx

from app.services.providers.base import BaseProviderAdapter, ProviderResponse


class OpenAIAdapter(BaseProviderAdapter):
    provider_key = 'openai'

    async def generate(self, messages):
        start = perf_counter()
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                (self.base_url or 'https://api.openai.com/v1') + '/chat/completions',
                headers={'Authorization': f'Bearer {self.api_key}'},
                json={'model': self.model_name, 'messages': messages, 'max_tokens': self.max_tokens},
            )
            response.raise_for_status()
            data = response.json()
        return ProviderResponse(
            text=data['choices'][0]['message']['content'],
            usage_input_tokens=data.get('usage', {}).get('prompt_tokens'),
            usage_output_tokens=data.get('usage', {}).get('completion_tokens'),
            finish_reason=data['choices'][0].get('finish_reason'),
            latency_ms=int((perf_counter() - start) * 1000),
            raw=data,
        )
