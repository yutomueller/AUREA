from time import perf_counter
import httpx

from app.services.providers.base import BaseProviderAdapter, ProviderResponse


class OpenAIAdapter(BaseProviderAdapter):
    provider_key = 'openai'

    @staticmethod
    def _normalize_content(content) -> str:
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            parts: list[str] = []
            for item in content:
                if isinstance(item, dict):
                    text_part = item.get('text')
                    if isinstance(text_part, str):
                        parts.append(text_part)
                elif isinstance(item, str):
                    parts.append(item)
            return '\n'.join(p for p in parts if p).strip()
        if content is None:
            return ''
        return str(content)

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

        message = (data.get('choices') or [{}])[0].get('message', {})
        text = self._normalize_content(message.get('content'))

        return ProviderResponse(
            text=text,
            usage_input_tokens=data.get('usage', {}).get('prompt_tokens'),
            usage_output_tokens=data.get('usage', {}).get('completion_tokens'),
            finish_reason=(data.get('choices') or [{}])[0].get('finish_reason'),
            latency_ms=int((perf_counter() - start) * 1000),
            raw=data,
        )
