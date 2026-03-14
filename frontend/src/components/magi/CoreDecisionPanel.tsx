import { useI18n } from '../../i18n';

type Props = { result?: string | null; status?: string; isRunning?: boolean };

export function CoreDecisionPanel({ result, status, isRunning = false }: Props) {
  const t = useI18n();
  const resolvedStatus = isRunning ? t.running : (status || t.idle);
  const resolvedResult = isRunning ? 'RUNNING' : (result || t.pending);
  const normalizedResult = resolvedResult.toUpperCase();
  const coreStateClass = normalizedResult === 'APPROVE'
    ? 'core-approve'
    : normalizedResult === 'REJECT'
      ? 'core-reject'
      : 'core-pending';

  return (
    <div className={`panel core ${coreStateClass} ${status?.toLowerCase()} ${isRunning ? 'is-running' : ''}`}>
      <div className="core-title">AUREA CORE</div>
      <div className="core-result">{resolvedResult}</div>
      <div className="core-status">{resolvedStatus}</div>
    </div>
  );
}
