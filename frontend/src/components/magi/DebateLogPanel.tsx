import { useMemo } from 'react';
import { useI18n } from '../../i18n';
import { getAgentAccentMap, type SessionMessage } from './messageUtils';

type Props = { messages: SessionMessage[] };

export function DebateLogPanel({ messages }: Props) {
  const t = useI18n();

  const accentByAgent = useMemo(() => {
    const orderedNames = Array.from(new Set(messages.map((message) => message.agent_name)));
    return getAgentAccentMap(orderedNames);
  }, [messages]);

  return (
    <div className="panel logs">
      <h3>{t.debateLog}</h3>
      <div className="log-list">
        {messages.map((message) => (
          <div className={`log-item ${accentByAgent.get(message.agent_name) ?? 'accent-1'}`} key={message.id}>
            <div className="log-head">{message.agent_name} · {message.phase} · {message.vote || '—'}</div>
            <div className="log-body">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
