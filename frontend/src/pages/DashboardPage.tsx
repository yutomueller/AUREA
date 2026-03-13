import { useEffect, useState } from 'react';
import { QueryInputForm } from '../components/forms/QueryInputForm';
import { RunModeSelector } from '../components/forms/RunModeSelector';
import { CoreDecisionPanel } from '../components/magi/CoreDecisionPanel';
import { DebateLogPanel } from '../components/magi/DebateLogPanel';
import { VoteMatrix } from '../components/magi/VoteMatrix';
import { AgentNodeCard } from '../components/magi/AgentNodeCard';
import { createSession, runSession } from '../services/sessions';
import { getAgentConfigs } from '../services/agents';
import { useSessionStore } from '../store/useSessionStore';

export function DashboardPage() {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [agentMode, setAgentMode] = useState<'THREE' | 'FIVE'>('THREE');
  const [decisionMode, setDecisionMode] = useState<'SIMPLE' | 'DEBATE'>('DEBATE');
  const [consensusRule, setConsensusRule] = useState<'MAJORITY' | 'UNANIMOUS'>('MAJORITY');
  const [agentConfigs, setAgentConfigs] = useState<any[]>([]);
  const { currentSession, setCurrentSession, loading, setLoading } = useSessionStore();

  useEffect(() => {
    getAgentConfigs(agentMode).then((res) => setAgentConfigs(res.items));
  }, [agentMode]);

  const execute = async () => {
    setLoading(true);
    try {
      const created = await createSession({ title, user_query: query, agent_mode: agentMode, decision_mode: decisionMode, consensus_rule: consensusRule });
      const result = await runSession(created.id);
      const detail = await (await fetch(`http://localhost:8000/api/sessions/${created.id}`)).json();
      setCurrentSession({ ...detail, result });
    } finally {
      setLoading(false);
    }
  };

  const messages = currentSession?.messages || [];

  return (
    <div className="dashboard-grid">
      <div className="left-col">
        <QueryInputForm title={title} query={query} setTitle={setTitle} setQuery={setQuery} />
        <RunModeSelector agentMode={agentMode} decisionMode={decisionMode} consensusRule={consensusRule} setAgentMode={setAgentMode} setDecisionMode={setDecisionMode} setConsensusRule={setConsensusRule} />
        <div className="panel control-bar">
          <button onClick={execute} disabled={loading || !query.trim()}>{loading ? 'Running...' : 'Execute'}</button>
        </div>
      </div>
      <div className="center-col">
        <CoreDecisionPanel result={currentSession?.session?.final_result || currentSession?.result?.final_result} summary={currentSession?.session?.final_summary || currentSession?.result?.final_summary} status={currentSession?.session?.status || currentSession?.result?.status} />
        <div className="agent-grid">
          {agentConfigs.map((item) => (
            <AgentNodeCard key={item.agent_name} name={item.agent_name} item={item} message={messages.find((m: any) => m.agent_name === item.agent_name)} />
          ))}
        </div>
        <VoteMatrix messages={messages} />
      </div>
      <div className="right-col">
        <DebateLogPanel messages={messages} />
      </div>
    </div>
  );
}
