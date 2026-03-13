import { useI18n } from '../../i18n';

type Props = {
  title: string;
  query: string;
  setTitle: (value: string) => void;
  setQuery: (value: string) => void;
};

export function QueryInputForm({ title, query, setTitle, setQuery }: Props) {
  const t = useI18n();

  return (
    <div className="panel form-grid">
      <label>
        {t.title}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.decisionTitle} />
      </label>
      <label>
        {t.query}
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={8} placeholder={t.describeAgenda} />
      </label>
    </div>
  );
}
