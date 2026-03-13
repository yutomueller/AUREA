from collections import Counter
from typing import Dict, List, Tuple


def normalize_vote(value: str) -> str:
    v = value.strip().upper()
    if v in {'APPROVE', 'APPROVED', '承認'}:
        return 'APPROVE'
    if v in {'REJECT', 'REJECTED', '否認'}:
        return 'REJECT'
    return 'REJECT'



def resolve_final_result(votes: Dict[str, str], agent_mode: str, consensus_rule: str) -> str:
    approve_count = sum(1 for v in votes.values() if normalize_vote(v) == 'APPROVE')
    if agent_mode == 'THREE' and consensus_rule == 'MAJORITY':
        return 'APPROVED' if approve_count >= 2 else 'REJECTED'
    if agent_mode == 'THREE' and consensus_rule == 'UNANIMOUS':
        return 'APPROVED' if approve_count == 3 else 'REJECTED'
    if agent_mode == 'FIVE' and consensus_rule == 'MAJORITY':
        return 'APPROVED' if approve_count >= 3 else 'REJECTED'
    if agent_mode == 'FIVE' and consensus_rule == 'UNANIMOUS':
        return 'APPROVED' if approve_count == 5 else 'REJECTED'
    return 'REJECTED'



def split_majority_minority(votes: Dict[str, str]) -> Tuple[List[str], List[str]]:
    norm = {k: normalize_vote(v) for k, v in votes.items()}
    counts = Counter(norm.values())
    majority_vote, _ = counts.most_common(1)[0]
    majority = [k for k, v in norm.items() if v == majority_vote]
    minority = [k for k, v in norm.items() if v != majority_vote]
    return majority, minority
