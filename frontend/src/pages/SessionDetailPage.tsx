import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionDetail } from '../services/sessions';
import { CoreDecisionPanel } from '../components/magi/CoreDecisionPanel';
import { DebateLogPanel } from '../components/magi/DebateLogPanel';
import { VoteMatrix } from '../components/magi/VoteMatrix';

export function SessionDetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => {
    if (id) getSessionDetail(id).then(setDetail);
  }, [id]);

  if (!detail) return <div className="panel">Loading...</div>;

  return (
    <div className="dashboard-grid">
      <div className="center-col">
        <CoreDecisionPanel result={detail.session.final_result} status={detail.session.status} />
        <VoteMatrix messages={detail.messages} />
      </div>
      <div className="right-col">
        <DebateLogPanel messages={detail.messages} />
      </div>
    </div>
  );
}
