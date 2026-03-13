import re
from typing import Dict

from app.services.orchestration.voting import normalize_vote


def _extract(text: str, label: str) -> str:
    pattern = r"\[" + re.escape(label) + r"\](.*?)(?=\n\[[A-Z_]+\]|$)"
    match = re.search(pattern, text, flags=re.S | re.I)
    return match.group(1).strip() if match else ''


def parse_independent_output(text: str) -> Dict[str, object]:
    vote = normalize_vote(_extract(text, 'VOTE') or ('APPROVE' if 'APPROVE' in text.upper() else 'REJECT'))
    conf_raw = _extract(text, 'CONFIDENCE')
    try:
        confidence = float(conf_raw)
    except Exception:
        confidence = 0.5
    return {
        'summary': _extract(text, 'SUMMARY'),
        'reasoning': _extract(text, 'REASONING') or text,
        'risks': _extract(text, 'RISKS'),
        'vote': vote,
        'confidence': confidence,
        'raw_text': text,
    }


def parse_debate_output(text: str) -> Dict[str, object]:
    vote = normalize_vote(_extract(text, 'VOTE') or ('APPROVE' if 'APPROVE' in text.upper() else 'REJECT'))
    conf_raw = _extract(text, 'CONFIDENCE')
    try:
        confidence = float(conf_raw)
    except Exception:
        confidence = 0.5
    return {
        'position': _extract(text, 'POSITION'),
        'counterpoint': _extract(text, 'COUNTERPOINT'),
        'revision': _extract(text, 'REVISION') or text,
        'vote': vote,
        'confidence': confidence,
        'raw_text': text,
    }
