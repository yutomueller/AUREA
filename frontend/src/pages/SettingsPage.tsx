import { useEffect, useRef, useState } from 'react';
import { AgentConfigForm } from '../components/forms/AgentConfigForm';
import { ProviderConfigForm } from '../components/forms/ProviderConfigForm';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { RunModeSelector } from '../components/forms/RunModeSelector';
import { getAgentConfigs, saveAgentConfigs } from '../services/agents';
import { getProviders, saveProvider, testProvider } from '../services/providers';
import { getUiSettings, saveUiSettings } from '../services/settings';
import { useSettingsStore } from '../store/useSettingsStore';
import { useI18n } from '../i18n';

const DEFAULT_PROVIDER_ITEMS = [
  { provider_key: 'openrouter', display_name: 'OpenRouter', base_url: 'https://openrouter.ai/api/v1', api_key: '', is_enabled: true },
  { provider_key: 'ollama', display_name: 'Ollama', base_url: 'http://localhost:11434', api_key: '', is_enabled: true },
  { provider_key: 'lmstudio', display_name: 'LM Studio', base_url: 'http://localhost:1234/v1', api_key: '', is_enabled: true },
];

const FALLBACK_AGENT_CONFIGS: Record<'THREE' | 'FIVE', Array<any>> = {
  THREE: [
    { agent_name: 'VERGILIUS', role_label: 'Strategy', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'HORATIUS', role_label: 'Ethics', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'OVIDIUS', role_label: 'Intuition', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
  ],
  FIVE: [
    { agent_name: 'VERGILIUS', role_label: 'Strategy', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'HORATIUS', role_label: 'Ethics', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'OVIDIUS', role_label: 'Intuition', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'LUCRETIUS', role_label: 'Analysis', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
    { agent_name: 'CATULLUS', role_label: 'Emotion', persona_description: '', system_prompt: '', provider_key: 'openrouter', model_name: 'openai/gpt-4o-mini', max_tokens: 512 },
  ],
};

export function SettingsPage() {
  const t = useI18n();
  const [mode, setMode] = useState<'THREE' | 'FIVE'>('THREE');
  const [agents, setAgents] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [saveNotice, setSaveNotice] = useState<{ id: number; message: string } | null>(null);
  const noticeSeqRef = useRef(0);
  const uiLanguage = useSettingsStore((s) => s.uiLanguage);
  const responseLanguage = useSettingsStore((s) => s.responseLanguage);
  const requestTimeoutSeconds = useSettingsStore((s) => s.requestTimeoutSeconds);
  const setRequestTimeoutSeconds = useSettingsStore((s) => s.setRequestTimeoutSeconds);
  const hydrate = useSettingsStore((s) => s.hydrate);
  const agentMode = useSettingsStore((s) => s.agentMode);
  const decisionMode = useSettingsStore((s) => s.decisionMode);
  const consensusRule = useSettingsStore((s) => s.consensusRule);
  const setAgentMode = useSettingsStore((s) => s.setAgentMode);
  const setDecisionMode = useSettingsStore((s) => s.setDecisionMode);
  const setConsensusRule = useSettingsStore((s) => s.setConsensusRule);

  useEffect(() => {
    setMode(agentMode);
  }, [agentMode]);

  useEffect(() => {
    setAgents(FALLBACK_AGENT_CONFIGS[mode]);
    getAgentConfigs(mode)
      .then((res) => setAgents(res?.items?.length ? res.items : FALLBACK_AGENT_CONFIGS[mode]))
      .catch(() => setAgents(FALLBACK_AGENT_CONFIGS[mode]));
  }, [mode]);

  useEffect(() => {
    getProviders()
      .then((res) => {
        const items = res?.items || [];
        setProviders(items.length ? items : DEFAULT_PROVIDER_ITEMS);
      })
      .catch(() => setProviders(DEFAULT_PROVIDER_ITEMS));

    getUiSettings()
      .then(hydrate)
      .catch(() => {
        // keep local defaults when server-side settings are unavailable
      });
  }, [hydrate]);

  useEffect(() => {
    if (!saveNotice) {
      return;
    }
    const timer = window.setTimeout(() => setSaveNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [saveNotice]);

  const showSaveNotice = () => {
    noticeSeqRef.current += 1;
    setSaveNotice({ id: noticeSeqRef.current, message: t.saveCompleted });
  };

  const saveLanguages = async () => {
    await saveUiSettings({
      theme_name: 'aurea',
      animation_level: 'MEDIUM',
      sound_enabled: false,
      density: 'NORMAL',
      ui_language: uiLanguage,
      response_language: responseLanguage,
      request_timeout_seconds: requestTimeoutSeconds,
    });
    showSaveNotice();
  };

  return (
    <div className="settings-grid">
      <div className="panel rounded-3xl border border-cyan-300/25 bg-slate-950/75">
        <h2>{t.language}</h2>
        <LanguageSwitcher onSave={saveLanguages} />
      </div>
      <div className="panel rounded-3xl border border-cyan-300/25 bg-slate-950/75">
        <h2>{t.requestTimeout}</h2>
        <label>
          {t.requestTimeout}
          <input
            type="number"
            min={5}
            max={600}
            value={requestTimeoutSeconds}
            onChange={(e) => setRequestTimeoutSeconds(Number(e.target.value || 60))}
          />
        </label>
        <button onClick={saveLanguages}>{t.save}</button>
      </div>
      <div className="panel rounded-3xl border border-cyan-300/25 bg-slate-950/75">
        <h2>{t.agentMode}</h2>
        <RunModeSelector
          agentMode={agentMode}
          decisionMode={decisionMode}
          consensusRule={consensusRule}
          setAgentMode={setAgentMode}
          setDecisionMode={setDecisionMode}
          setConsensusRule={setConsensusRule}
        />
      </div>
      <div className="panel rounded-3xl border border-cyan-300/25 bg-slate-950/75">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="m-0">{t.agents}</h2>
          <label className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
            config mode
            <select
              className="ml-2 rounded-full border border-cyan-300/40 bg-slate-900/80 px-3 py-1 text-cyan-100"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'THREE' | 'FIVE')}
            >
              <option value="THREE">3 Agents</option>
              <option value="FIVE">5 Agents</option>
            </select>
          </label>
        </div>
        {agents.map((item, index) => (
          <AgentConfigForm key={item.agent_name} item={item} onChange={(next) => setAgents((curr) => curr.map((it, i) => i === index ? next : it))} />
        ))}
        <button
          onClick={async () => {
            await saveAgentConfigs({ mode_group: mode, items: agents });
            showSaveNotice();
          }}
        >
          {t.saveAgents}
        </button>
      </div>
      <div className="panel rounded-3xl border border-cyan-300/25 bg-slate-950/75">
        <h2>{t.providers}</h2>
        {providers.map((item: any, index: number) => (
          <ProviderConfigForm
            key={item.provider_key}
            item={item}
            onChange={(next) => setProviders((curr) => curr.map((it, i) => i === index ? next : it))}
            onTest={async () => alert(JSON.stringify(await testProvider(item)))}
          />
        ))}
        {providers.map((item: any) => (
          <button
            key={`${item.provider_key}-save`}
            onClick={async () => {
              await saveProvider(item);
              showSaveNotice();
            }}
          >
            {t.save} {item.provider_key}
          </button>
        ))}
      </div>
      {saveNotice && <p key={saveNotice.id} className="save-toast">{saveNotice.message}</p>}
    </div>
  );
}
