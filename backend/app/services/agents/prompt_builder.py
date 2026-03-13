COMMON_FORMAT = """
Return strictly in this format:
[SUMMARY]
1-3 sentences

[REASONING]
Your reasoning

[RISKS]
Key risks

[VOTE]
APPROVE or REJECT

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
        f"{COMMON_FORMAT}\n"
        f"User query:\n{user_query}"
    )


def build_debate_prompt(system_prompt: str, user_query: str, own_view: str, opposing_summary: str, response_language: str) -> str:
    return (
        f"{system_prompt}\n\n"
        f"{LANGUAGE_RULES.get(response_language, 'Respond in English.')}\n"
        "Revise or defend your previous position after reading the opposing summary.\n"
        "Return strictly in this format:\n"
        "[POSITION]\n...\n\n"
        "[COUNTERPOINT]\n...\n\n"
        "[REVISION]\n...\n\n"
        "[VOTE]\nAPPROVE or REJECT\n\n"
        "[CONFIDENCE]\n0.00-1.00\n\n"
        f"User query:\n{user_query}\n\n"
        f"Your previous view:\n{own_view}\n\n"
        f"Opposing summary:\n{opposing_summary}"
    )
