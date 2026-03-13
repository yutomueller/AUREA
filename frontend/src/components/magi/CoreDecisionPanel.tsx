import { useI18n } from '../../i18n';

type Props = { result?: string | null; status?: string };

export function CoreDecisionPanel({ result, status }: Props) {
  const t = useI18n();

  return (
    <div className={`panel core ${status?.toLowerCase()}`}>
      <div className="core-title">AUREA CORE</div>
      <div className="core-result">{result || t.pending}</div>
      <div className="core-status">{status || t.idle}</div>
    </div>
  );
}
