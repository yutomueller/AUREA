import { useI18n } from '../../i18n';

type Props = { messages: any[] };

export function VoteMatrix({ messages }: Props) {
  const t = useI18n();

  return (
    <div className="panel">
      <h3>{t.voteMatrix}</h3>
      <table className="table">
        <thead>
          <tr><th>{t.agent}</th><th>{t.round}</th><th>{t.phase}</th><th>{t.vote}</th><th>{t.confidence}</th></tr>
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
