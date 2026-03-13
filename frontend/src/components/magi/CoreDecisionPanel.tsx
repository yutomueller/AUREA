type Props = { result?: string | null; summary?: string | null; status?: string };

export function CoreDecisionPanel({ result, summary, status }: Props) {
  return (
    <div className={`panel core ${status?.toLowerCase()}`}>
      <div className="core-title">AUREA CORE</div>
      <div className="core-result">{result || 'PENDING'}</div>
      <div className="core-status">{status || 'IDLE'}</div>
      <p className="muted">{summary || 'Awaiting deliberation.'}</p>
    </div>
  );
}
