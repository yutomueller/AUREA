type Props = { messages: any[] };

export function VoteMatrix({ messages }: Props) {
  return (
    <div className="panel">
      <h3>Vote Matrix</h3>
      <table className="table">
        <thead>
          <tr><th>Agent</th><th>Round</th><th>Phase</th><th>Vote</th><th>Confidence</th></tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.agent_name}</td>
              <td>{m.round_no}</td>
              <td>{m.phase}</td>
              <td>{m.vote || '—'}</td>
              <td>{m.confidence ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
