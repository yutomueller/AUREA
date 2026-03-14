export type SessionMessage = {
  id: string;
  round_no?: number;
  phase?: string;
  agent_name: string;
  content?: string;
  vote?: string | null;
  created_at?: string;
};

const AGENT_ACCENT_CLASSES = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'] as const;

const toTimestamp = (value?: string) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const compareMessages = (a: SessionMessage, b: SessionMessage) => {
  const roundDiff = (a.round_no ?? 0) - (b.round_no ?? 0);
  if (roundDiff !== 0) return roundDiff;

  const timeDiff = toTimestamp(a.created_at) - toTimestamp(b.created_at);
  if (timeDiff !== 0) return timeDiff;

  return (a.id || '').localeCompare(b.id || '');
};

export const getLatestMessagesByAgent = (messages: SessionMessage[]) => {
  const latestByAgent = new Map<string, SessionMessage>();

  messages.forEach((message) => {
    const previous = latestByAgent.get(message.agent_name);
    if (!previous || compareMessages(previous, message) <= 0) {
      latestByAgent.set(message.agent_name, message);
    }
  });

  return latestByAgent;
};

export const getAgentAccentMap = (agentNames: string[]) => {
  const map = new Map<string, string>();

  agentNames.forEach((agentName, index) => {
    map.set(agentName, AGENT_ACCENT_CLASSES[index % AGENT_ACCENT_CLASSES.length]);
  });

  return map;
};
