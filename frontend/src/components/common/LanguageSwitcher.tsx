import { useSettingsStore } from '../../store/useSettingsStore';

type Props = {
  onSave?: () => void;
};

export function LanguageSwitcher({ onSave }: Props) {
  const { uiLanguage, responseLanguage, setUiLanguage, setResponseLanguage } = useSettingsStore();

  return (
    <div className="panel form-grid">
      <label>
        UI Language
        <select value={uiLanguage} onChange={(e) => setUiLanguage(e.target.value as 'ja' | 'en')}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <label>
        Response Language
        <select value={responseLanguage} onChange={(e) => setResponseLanguage(e.target.value as 'ja' | 'en')}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      {onSave ? <button onClick={onSave}>Save language</button> : null}
    </div>
  );
}
