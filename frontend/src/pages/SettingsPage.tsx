import { useEffect, useState } from 'react';
import { AgentConfigForm } from '../components/forms/AgentConfigForm';
import { ProviderConfigForm } from '../components/forms/ProviderConfigForm';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { getAgentConfigs, saveAgentConfigs } from '../services/agents';
import { getProviders, saveProvider, testProvider } from '../services/providers';
import { getUiSettings, saveUiSettings } from '../services/settings';
import { useSettingsStore } from '../store/useSettingsStore';

export function SettingsPage() {
  const [mode, setMode] = useState<'THREE' | 'FIVE'>('THREE');
  const [agents, setAgents] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const { uiLanguage, responseLanguage, hydrate } = useSettingsStore();

  useEffect(() => {
    getAgentConfigs(mode).then((res) => setAgents(res.items));
  }, [mode]);

  useEffect(() => {
    getProviders().then((res) => setProviders(res.items || []));
    getUiSettings().then(hydrate);
  }, [hydrate]);

  const saveLanguages = async () => {
    await saveUiSettings({ theme_name: 'aurea', animation_level: 'MEDIUM', sound_enabled: false, density: 'NORMAL', ui_language: uiLanguage, response_language: responseLanguage });
  };

  return (
    <div className="settings-grid">
      <div className="panel">
        <h2>Language</h2>
        <LanguageSwitcher onSave={saveLanguages} />
      </div>
      <div className="panel">
        <h2>Agent Mode</h2>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'THREE' | 'FIVE')}>
          <option value="THREE">Three Agents</option>
          <option value="FIVE">Five Agents</option>
        </select>
      </div>
      <div className="panel">
        <h2>Agents</h2>
        {agents.map((item, index) => (
          <AgentConfigForm key={item.agent_name} item={item} onChange={(next) => setAgents((curr) => curr.map((it, i) => i === index ? next : it))} />
        ))}
        <button onClick={() => saveAgentConfigs({ mode_group: mode, items: agents })}>Save agents</button>
      </div>
      <div className="panel">
        <h2>Providers</h2>
        {providers.map((item: any, index: number) => (
          <ProviderConfigForm
            key={item.provider_key}
            item={item}
            onChange={(next) => setProviders((curr) => curr.map((it, i) => i === index ? next : it))}
            onTest={async () => alert(JSON.stringify(await testProvider(item)))}
          />
        ))}
        {providers.map((item: any) => (
          <button key={`${item.provider_key}-save`} onClick={() => saveProvider(item)}>Save {item.provider_key}</button>
        ))}
      </div>
    </div>
  );
}
