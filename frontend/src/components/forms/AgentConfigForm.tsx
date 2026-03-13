type Props = {
  item: any;
  onChange: (next: any) => void;
};

const PROVIDER_OPTIONS = [
  { value: 'openrouter', label: 'OpenRouter (default)' },
  { value: 'ollama', label: 'Ollama (local)' },
  { value: 'lmstudio', label: 'LM Studio (local)' },
];

export function AgentConfigForm({ item, onChange }: Props) {
  return (
    <div className="panel form-grid">
      <h3>{item.agent_name}</h3>
      <label>
        Role Label
        <input value={item.role_label} onChange={(e) => onChange({ ...item, role_label: e.target.value })} />
      </label>
      <label>
        Persona Description
        <textarea rows={3} value={item.persona_description} onChange={(e) => onChange({ ...item, persona_description: e.target.value })} />
      </label>
      <label>
        System Prompt
        <textarea rows={6} value={item.system_prompt} onChange={(e) => onChange({ ...item, system_prompt: e.target.value })} />
      </label>
      <label>
        Provider
        <select value={item.provider_key} onChange={(e) => onChange({ ...item, provider_key: e.target.value })}>
          {PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label>
        Model
        <input value={item.model_name} onChange={(e) => onChange({ ...item, model_name: e.target.value })} />
      </label>
      <label>
        Max Tokens
        <input type="number" value={item.max_tokens} onChange={(e) => onChange({ ...item, max_tokens: Number(e.target.value) })} />
      </label>
    </div>
  );
}
