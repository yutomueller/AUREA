import { useI18n } from '../../i18n';

type Props = {
  name: string;
  item?: any;
  message?: any;
  index?: number;
  isRunning?: boolean;
};

export function AgentNodeCard({ name, item, message, index = 0, isRunning = false }: Props) {
  const t = useI18n();
  const stateClass = (message?.vote || 'idle').toLowerCase();
  const accentClass = `accent-${(index % 5) + 1}`;

  return (
    <div className={`agent-card ${stateClass} ${accentClass} ${isRunning && !message ? 'running' : ''}`}>
      <div className="agent-name">{name}</div>
      <div className="agent-role">{item?.role_label || '-'}</div>
      <div className="agent-meta">{item?.provider_key} / {item?.model_name}</div>
      <div className="agent-vote">{message?.vote || (isRunning ? t.running : t.pending)}</div>
    </div>
  );
}
