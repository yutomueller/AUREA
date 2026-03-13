import { useEffect, useState } from 'react';
import { CoreDecisionPanel } from '../components/magi/CoreDecisionPanel';
import { DebateLogPanel } from '../components/magi/DebateLogPanel';
import { ResponsePanels } from '../components/magi/ResponsePanels';
import { AgentNodeCard } from '../components/magi/AgentNodeCard';
import { createSession, runSession } from '../services/sessions';
import { getAgentConfigs } from '../services/agents';
import { useSessionStore } from '../store/useSessionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useI18n } from '../i18n';


const FALLBACK_AGENT_CONFIGS: Record<'THREE' | 'FIVE', Array<{ agent_name: string; role_label: string; provider_key: string; model_name: string }>> = {
  THREE: [
    { agent_name: 'MELCHIOR', role_label: 'Logic', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'BALTHASAR', role_label: 'Emotion', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'CASPER', role_label: 'Instinct', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
  ],
  FIVE: [
    { agent_name: 'MELCHIOR', role_label: 'Logic', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'BALTHASAR', role_label: 'Emotion', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'CASPER', role_label: 'Instinct', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'RAPHAEL', role_label: 'Risk', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'URIEL', role_label: 'Ethics', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
  ],
};

export function DashboardPage() {
  const t = useI18n();
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const agentMode = useSettingsStore((s) => s.agentMode);
  const decisionMode = useSettingsStore((s) => s.decisionMode);
  const consensusRule = useSettingsStore((s) => s.consensusRule);
  const [agentConfigs, setAgentConfigs] = useState<any[]>([]);
  const { currentSession, setCurrentSession, loading, setLoading } = useSessionStore();

  useEffect(() => {
    setAgentConfigs(FALLBACK_AGENT_CONFIGS[agentMode]);
    getAgentConfigs(agentMode)
      .then((res) => setAgentConfigs((res?.items?.length ? res.items : FALLBACK_AGENT_CONFIGS[agentMode])))
      .catch(() => setAgentConfigs(FALLBACK_AGENT_CONFIGS[agentMode]));
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
    <div className="dashboard-grid main-expanded">
      <div className="center-col">
        <section className={`panel magi-stage ${agentMode === 'THREE' ? 'triangle' : 'pentagon'}`}>
          <div className="core-slot">
            <CoreDecisionPanel result={currentSession?.session?.final_result || currentSession?.result?.final_result} summary={currentSession?.session?.final_summary || currentSession?.result?.final_summary} status={currentSession?.session?.status || currentSession?.result?.status} />
          </div>
          <div className="agent-grid">
            {agentConfigs.map((item, index) => (
              <AgentNodeCard key={item.agent_name} index={index} name={item.agent_name} item={item} message={messages.find((m: any) => m.agent_name === item.agent_name)} />
            ))}
          </div>
        </section>
        <section className="panel prompt-composer">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.decisionTitle}
            className="prompt-title"
          />
          <div className="prompt-row">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              placeholder={t.describeAgenda}
              className="prompt-input"
            />
            <button className="prompt-send" onClick={execute} disabled={loading || !query.trim()}>
              {loading ? t.running : t.execute}
            </button>
          </div>
        </section>
      </div>
      <div className="right-col">
        <ResponsePanels messages={messages} />
        <DebateLogPanel messages={messages} />
      </div>
    </div>
  );
}
