import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../services/sessions';
import { useSessionStore } from '../store/useSessionStore';
import { useI18n } from '../i18n';

export function HistoryPage() {
  const t = useI18n();
  const { sessions, setSessions } = useSessionStore();

  useEffect(() => {
    getSessions().then((res) => setSessions(res.items));
  }, [setSessions]);

  return (
    <div className="panel">
      <h2>{t.history}</h2>
      <table className="table">
        <thead>
          <tr><th>{t.title}</th><th>{t.mode}</th><th>{t.decision}</th><th>{t.rule}</th><th>{t.status}</th><th>{t.result}</th><th /></tr>
        </thead>
        <tbody>
          {sessions.map((item) => (
            <tr key={item.id}>
              <td>{item.title || t.untitled}</td>
              <td>{item.agent_mode}</td>
              <td>{item.decision_mode}</td>
              <td>{item.consensus_rule}</td>
              <td>{item.status}</td>
              <td>{item.final_result || '—'}</td>
              <td><Link to={`/history/${item.id}`}>{t.open}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
