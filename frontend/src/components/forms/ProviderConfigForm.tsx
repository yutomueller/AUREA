type Props = {
  item: any;
  onChange: (next: any) => void;
  onTest: () => void;
};

export function ProviderConfigForm({ item, onChange, onTest }: Props) {
  return (
    <div className="panel form-grid">
      <label>
        Provider
        <input value={item.provider_key} disabled />
      </label>
      <label>
        Display Name
        <input value={item.display_name || ''} onChange={(e) => onChange({ ...item, display_name: e.target.value })} />
      </label>
      <label>
        Base URL
        <input value={item.base_url || ''} onChange={(e) => onChange({ ...item, base_url: e.target.value })} />
      </label>
      <label>
        API Key
        <input type="password" value={item.api_key || ''} onChange={(e) => onChange({ ...item, api_key: e.target.value })} />
      </label>
      <button onClick={onTest}>Test connection</button>
    </div>
  );
}
