import { useEffect, useState } from 'react';
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

export function SettingsPage() {
  const t = useI18n();
  const [mode, setMode] = useState<'THREE' | 'FIVE'>('THREE');
  const [agents, setAgents] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
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
    getAgentConfigs(mode)
      .then((res) => setAgents(res.items || []))
      .catch(() => setAgents([]));
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
  };

  return (
    <div className="settings-grid">
      <div className="panel">
        <h2>{t.language}</h2>
        <LanguageSwitcher onSave={saveLanguages} />
      </div>
      <div className="panel">
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
      <div className="panel">
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
      <div className="panel">
        <h2>{t.agents}</h2>
        {agents.map((item, index) => (
          <AgentConfigForm key={item.agent_name} item={item} onChange={(next) => setAgents((curr) => curr.map((it, i) => i === index ? next : it))} />
        ))}
        <button onClick={() => saveAgentConfigs({ mode_group: mode, items: agents })}>{t.saveAgents}</button>
      </div>
      <div className="panel">
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
          <button key={`${item.provider_key}-save`} onClick={() => saveProvider(item)}>{t.save} {item.provider_key}</button>
        ))}
      </div>
    </div>
  );
}
