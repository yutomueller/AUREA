import { useI18n } from '../../i18n';

type Props = {
  agentMode: 'THREE' | 'FIVE';
  decisionMode: 'SIMPLE' | 'DEBATE';
  consensusRule: 'MAJORITY' | 'UNANIMOUS';
  setAgentMode: (value: 'THREE' | 'FIVE') => void;
  setDecisionMode: (value: 'SIMPLE' | 'DEBATE') => void;
  setConsensusRule: (value: 'MAJORITY' | 'UNANIMOUS') => void;
};

export function RunModeSelector(props: Props) {
  const t = useI18n();

  return (
    <div className="panel form-grid cols-3">
      <label>
        {t.agents}
        <select value={props.agentMode} onChange={(e) => props.setAgentMode(e.target.value as 'THREE' | 'FIVE')}>
          <option value="THREE">3</option>
          <option value="FIVE">5</option>
        </select>
      </label>
      <label>
        {t.mode}
        <select value={props.decisionMode} onChange={(e) => props.setDecisionMode(e.target.value as 'SIMPLE' | 'DEBATE')}>
          <option value="SIMPLE">{t.simple}</option>
          <option value="DEBATE">{t.debate}</option>
        </select>
      </label>
      <label>
        {t.rule}
        <select value={props.consensusRule} onChange={(e) => props.setConsensusRule(e.target.value as 'MAJORITY' | 'UNANIMOUS')}>
          <option value="MAJORITY">{t.majority}</option>
          <option value="UNANIMOUS">{t.unanimous}</option>
        </select>
      </label>
    </div>
  );
}
