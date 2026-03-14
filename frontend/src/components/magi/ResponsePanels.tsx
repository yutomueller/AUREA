import { useMemo } from 'react';
import { useI18n } from '../../i18n';
import { compareMessages, getAgentAccentMap, getLatestMessagesByAgent, type SessionMessage } from './messageUtils';

type Props = { messages: SessionMessage[] };

export function ResponsePanels({ messages }: Props) {
  const t = useI18n();

  const latestByAgent = useMemo(() => getLatestMessagesByAgent(messages), [messages]);

  const latestMessages = useMemo(() => {
    return Array.from(latestByAgent.values()).sort(compareMessages);
  }, [latestByAgent]);

  const accentByAgent = useMemo(() => {
    return getAgentAccentMap(latestMessages.map((message) => message.agent_name));
  }, [latestMessages]);

  return (
    <div className="panel response-panels">
      <h3>{t.responses}</h3>
      <div className="response-panel-list">
        {latestMessages.map((message) => {
          const accentClass = accentByAgent.get(message.agent_name) ?? 'accent-1';
          return (
            <article className={`response-panel-item ${accentClass}`} key={`${message.agent_name}-${message.phase}-${message.id}`}>
              <header className="response-panel-head">
                <strong>{message.agent_name}</strong>
                <span>{message.phase} · {message.vote || '—'}</span>
              </header>
              <p className="response-panel-body">{message.content || t.noOutput}</p>
            </article>
          );
        })}
        {latestMessages.length === 0 && <p className="muted">{t.awaiting}</p>}
      </div>
    </div>
  );
}
