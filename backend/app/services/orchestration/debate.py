from typing import Dict, List


def summarize_opposition(outputs: Dict[str, dict], names: List[str]) -> str:
    parts = []
    for name in names:
        item = outputs[name]
        parts.append(f"{name}: {item.get('summary') or item.get('reasoning', '')[:300]}")
    return "\n".join(parts)
