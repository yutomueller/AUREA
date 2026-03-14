import re
from collections import Counter
from typing import Dict, List, Tuple


def normalize_vote(value: str) -> str:
    v = (value or '').strip().upper()
    if not v:
        return 'REJECT'

    token_match = re.search(r'\b(APPROVE|REJECT|APPROVED|REJECTED)\b', v)
    if token_match:
        token = token_match.group(1)
        if token in {'APPROVE', 'APPROVED'}:
            return 'APPROVE'
        return 'REJECT'

    if any(k in v for k in {'承認', '可決', '賛成'}):
        return 'APPROVE'
    if any(k in v for k in {'否認', '却下', '反対'}):
        return 'REJECT'
    return 'REJECT'



def resolve_final_result(votes: Dict[str, str], agent_mode: str, consensus_rule: str) -> str:
    approve_count = sum(1 for v in votes.values() if normalize_vote(v) == 'APPROVE')
    if agent_mode == 'THREE' and consensus_rule == 'MAJORITY':
        return 'APPROVE' if approve_count >= 2 else 'REJECT'
    if agent_mode == 'THREE' and consensus_rule == 'UNANIMOUS':
        return 'APPROVE' if approve_count == 3 else 'REJECT'
    if agent_mode == 'FIVE' and consensus_rule == 'MAJORITY':
        return 'APPROVE' if approve_count >= 3 else 'REJECT'
    if agent_mode == 'FIVE' and consensus_rule == 'UNANIMOUS':
        return 'APPROVE' if approve_count == 5 else 'REJECT'
    return 'REJECT'



def split_majority_minority(votes: Dict[str, str]) -> Tuple[List[str], List[str]]:
    norm = {k: normalize_vote(v) for k, v in votes.items()}
    counts = Counter(norm.values())
    majority_vote, _ = counts.most_common(1)[0]
    majority = [k for k, v in norm.items() if v == majority_vote]
    minority = [k for k, v in norm.items() if v != majority_vote]
    return majority, minority
