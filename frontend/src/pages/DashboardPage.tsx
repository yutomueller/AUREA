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
    { agent_name: 'VERGILIUS', role_label: 'Strategy', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'HORATIUS', role_label: 'Ethics', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'OVIDIUS', role_label: 'Intuition', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
  ],
  FIVE: [
    { agent_name: 'VERGILIUS', role_label: 'Strategy', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'HORATIUS', role_label: 'Ethics', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'OVIDIUS', role_label: 'Intuition', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'LUCRETIUS', role_label: 'Analysis', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
    { agent_name: 'CATULLUS', role_label: 'Emotion', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini' },
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

  const resetToStart = () => {
    setTitle('');
    setQuery('');
    setCurrentSession(null);
  };

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
        <section
          className={`panel magi-stage rounded-3xl border border-cyan-300/30 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950/95 shadow-neon ${agentMode === 'THREE' ? 'triangle' : 'pentagon'}`}
        >
          <div className="core-slot">
            <CoreDecisionPanel
              result={currentSession?.session?.final_result || currentSession?.result?.final_result}
              status={currentSession?.session?.status || currentSession?.result?.status}
              isRunning={loading}
            />
          </div>
          <div className="agent-grid">
            {agentConfigs.map((item, index) => (
              <AgentNodeCard key={item.agent_name} index={index} name={item.agent_name} item={item} message={messages.find((m: any) => m.agent_name === item.agent_name)} />
            ))}
          </div>
        </section>
        <section className="panel prompt-composer rounded-3xl border border-cyan-300/35 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-cyan-950/40 shadow-neon">
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Mission Control</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.decisionTitle}
            className="prompt-title border-cyan-200/40 bg-slate-950/80 focus:border-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
          <div className="prompt-actions">
            <button className="prompt-reset border-cyan-200/50 text-cyan-100 hover:bg-cyan-300/10" onClick={resetToStart}>
              {t.resetHome}
            </button>
          </div>
          <div className="prompt-row">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              placeholder={t.describeAgenda}
              className="prompt-input border-cyan-300/40 bg-slate-950/80 focus:border-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <button
              className="prompt-send border-emerald-300/50 bg-gradient-to-r from-cyan-500/35 to-emerald-400/25 text-cyan-50 enabled:hover:from-cyan-400/45 enabled:hover:to-emerald-300/35 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={execute}
              disabled={loading || !query.trim()}
            >
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
