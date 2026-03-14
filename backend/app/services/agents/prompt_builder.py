COMMON_FORMAT = """
Return strictly in this format:
[SUMMARY]
1-3 sentences

[REASONING]
Your reasoning

[RISKS]
Key risks and optional conditions. If there are conditions, explain them here.

[VOTE]
Write exactly one token: APPROVE or REJECT

[CONFIDENCE]
0.00-1.00
"""

LANGUAGE_RULES = {
    'ja': 'Respond in Japanese.',
    'en': 'Respond in English.',
}


def build_independent_prompt(system_prompt: str, user_query: str, response_language: str) -> str:
    return (
        f"{system_prompt}\n\n"
        f"{LANGUAGE_RULES.get(response_language, 'Respond in English.')}\n"
        "Judge independently without referencing other agents.\n"
        "You must choose a definitive conclusion in [VOTE]. Do not output conditional votes such as conditional approve/reject.\n"
        "Place any conditions, caveats, or assumptions in [RISKS], while still choosing APPROVE or REJECT in [VOTE].\n"
        f"{COMMON_FORMAT}\n"
        f"User query:\n{user_query}"
    )


def build_debate_prompt(system_prompt: str, user_query: str, own_view: str, opposing_summary: str, response_language: str) -> str:
    return (
        f"{system_prompt}\n\n"
        f"{LANGUAGE_RULES.get(response_language, 'Respond in English.')}\n"
        "Revise or defend your previous position after reading the opposing summary.\n"
        "You must choose a definitive conclusion in [VOTE]. Do not output conditional votes.\n"
        "Put all conditions/caveats in [REVISION] or [COUNTERPOINT], but [VOTE] must be exactly APPROVE or REJECT.\n"
        "Return strictly in this format:\n"
        "[POSITION]\n...\n\n"
        "[COUNTERPOINT]\n...\n\n"
        "[REVISION]\n...\n\n"
        "[VOTE]\nWrite exactly one token: APPROVE or REJECT\n\n"
        "[CONFIDENCE]\n0.00-1.00\n\n"
        f"User query:\n{user_query}\n\n"
        f"Your previous view:\n{own_view}\n\n"
        f"Opposing summary:\n{opposing_summary}"
    )
