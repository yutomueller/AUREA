import { useI18n } from '../../i18n';

type Props = {
  name: string;
  item?: any;
  message?: any;
};

export function AgentNodeCard({ name, item, message }: Props) {
  const t = useI18n();
  const stateClass = (message?.vote || 'idle').toLowerCase();
  return (
    <div className={`agent-card ${stateClass}`}>
      <div className="agent-name">{name}</div>
      <div className="agent-role">{item?.role_label || '-'}</div>
      <div className="agent-meta">{item?.provider_key} / {item?.model_name}</div>
      <div className="agent-vote">{message?.vote || t.pending}</div>
      <div className="agent-summary">{message?.content?.slice(0, 180) || t.noOutput}</div>
    </div>
  );
}
