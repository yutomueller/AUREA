import re
from typing import Dict

from app.services.orchestration.voting import normalize_vote


def _safe_text(text: object) -> str:
    if isinstance(text, str):
        return text
    if text is None:
        return ''
    return str(text)


def _extract(text: object, label: str) -> str:
    safe = _safe_text(text)
    pattern = r"\[" + re.escape(label) + r"\](.*?)(?=\n\[[A-Z_]+\]|$)"
    match = re.search(pattern, safe, flags=re.S | re.I)
    return match.group(1).strip() if match else ''


def parse_independent_output(text: object) -> Dict[str, object]:
    safe = _safe_text(text)
    vote = normalize_vote(_extract(safe, 'VOTE') or ('APPROVE' if 'APPROVE' in safe.upper() else 'REJECT'))
    conf_raw = _extract(safe, 'CONFIDENCE')
    try:
        confidence = float(conf_raw)
    except Exception:
        confidence = 0.5
    return {
        'summary': _extract(safe, 'SUMMARY'),
        'reasoning': _extract(safe, 'REASONING') or safe,
        'risks': _extract(safe, 'RISKS'),
        'vote': vote,
        'confidence': confidence,
        'raw_text': safe,
    }


def parse_debate_output(text: object) -> Dict[str, object]:
    safe = _safe_text(text)
    vote = normalize_vote(_extract(safe, 'VOTE') or ('APPROVE' if 'APPROVE' in safe.upper() else 'REJECT'))
    conf_raw = _extract(safe, 'CONFIDENCE')
    try:
        confidence = float(conf_raw)
    except Exception:
        confidence = 0.5
    return {
        'position': _extract(safe, 'POSITION'),
        'counterpoint': _extract(safe, 'COUNTERPOINT'),
        'revision': _extract(safe, 'REVISION') or safe,
        'vote': vote,
        'confidence': confidence,
        'raw_text': safe,
    }
