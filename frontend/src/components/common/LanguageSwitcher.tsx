import { useI18n } from '../../i18n';
import { useSettingsStore } from '../../store/useSettingsStore';

type Props = {
  onSave?: () => void;
};

export function LanguageSwitcher({ onSave }: Props) {
  const t = useI18n();
  const { uiLanguage, responseLanguage, setUiLanguage, setResponseLanguage } = useSettingsStore();

  return (
    <div className="panel form-grid">
      <label>
        {t.uiLanguage}
        <select value={uiLanguage} onChange={(e) => setUiLanguage(e.target.value as 'ja' | 'en')}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <label>
        {t.responseLanguage}
        <select value={responseLanguage} onChange={(e) => setResponseLanguage(e.target.value as 'ja' | 'en')}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      {onSave ? <button onClick={onSave}>{t.saveLanguage}</button> : null}
    </div>
  );
}
