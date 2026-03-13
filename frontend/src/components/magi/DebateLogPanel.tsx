type Props = { messages: any[] };

export function DebateLogPanel({ messages }: Props) {
  return (
    <div className="panel logs">
      <h3>Debate Log</h3>
      <div className="log-list">
        {messages.map((m) => (
          <div className="log-item" key={m.id}>
            <div className="log-head">{m.agent_name} · {m.phase} · {m.vote || '—'}</div>
            <div className="log-body">{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
