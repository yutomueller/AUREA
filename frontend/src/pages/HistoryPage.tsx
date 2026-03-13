import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions } from '../services/sessions';
import { useSessionStore } from '../store/useSessionStore';

export function HistoryPage() {
  const { sessions, setSessions } = useSessionStore();

  useEffect(() => {
    getSessions().then((res) => setSessions(res.items));
  }, [setSessions]);

  return (
    <div className="panel">
      <h2>History</h2>
      <table className="table">
        <thead>
          <tr><th>Title</th><th>Mode</th><th>Decision</th><th>Rule</th><th>Status</th><th>Result</th><th /></tr>
        </thead>
        <tbody>
          {sessions.map((item) => (
            <tr key={item.id}>
              <td>{item.title || 'Untitled'}</td>
              <td>{item.agent_mode}</td>
              <td>{item.decision_mode}</td>
              <td>{item.consensus_rule}</td>
              <td>{item.status}</td>
              <td>{item.final_result || '—'}</td>
              <td><Link to={`/history/${item.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
