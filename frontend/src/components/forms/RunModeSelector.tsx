type Props = {
  agentMode: 'THREE' | 'FIVE';
  decisionMode: 'SIMPLE' | 'DEBATE';
  consensusRule: 'MAJORITY' | 'UNANIMOUS';
  setAgentMode: (value: 'THREE' | 'FIVE') => void;
  setDecisionMode: (value: 'SIMPLE' | 'DEBATE') => void;
  setConsensusRule: (value: 'MAJORITY' | 'UNANIMOUS') => void;
};

export function RunModeSelector(props: Props) {
  return (
    <div className="panel form-grid cols-3">
      <label>
        Agents
        <select value={props.agentMode} onChange={(e) => props.setAgentMode(e.target.value as 'THREE' | 'FIVE')}>
          <option value="THREE">3</option>
          <option value="FIVE">5</option>
        </select>
      </label>
      <label>
        Mode
        <select value={props.decisionMode} onChange={(e) => props.setDecisionMode(e.target.value as 'SIMPLE' | 'DEBATE')}>
          <option value="SIMPLE">Simple</option>
          <option value="DEBATE">Debate</option>
        </select>
      </label>
      <label>
        Rule
        <select value={props.consensusRule} onChange={(e) => props.setConsensusRule(e.target.value as 'MAJORITY' | 'UNANIMOUS')}>
          <option value="MAJORITY">Majority</option>
          <option value="UNANIMOUS">Unanimous</option>
        </select>
      </label>
    </div>
  );
}
