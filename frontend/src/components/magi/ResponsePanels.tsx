import { useMemo } from 'react';
import { useI18n } from '../../i18n';

type Props = { messages: any[] };

export function ResponsePanels({ messages }: Props) {
  const t = useI18n();

  const latestByAgent = useMemo(() => {
    const map = new Map<string, any>();
    messages.forEach((message) => {
      map.set(message.agent_name, message);
    });
    return Array.from(map.values());
  }, [messages]);

  return (
    <div className="panel response-panels">
      <h3>{t.responses}</h3>
      <div className="response-panel-list">
        {latestByAgent.map((m) => (
          <article className="response-panel-item" key={`${m.agent_name}-${m.phase}-${m.id}`}>
            <header className="response-panel-head">
              <strong>{m.agent_name}</strong>
              <span>{m.phase} · {m.vote || '—'}</span>
            </header>
            <p className="response-panel-body">{m.content || t.noOutput}</p>
          </article>
        ))}
        {latestByAgent.length === 0 && <p className="muted">{t.awaiting}</p>}
      </div>
    </div>
  );
}
