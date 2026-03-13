type Props = {
  title: string;
  query: string;
  setTitle: (value: string) => void;
  setQuery: (value: string) => void;
};

export function QueryInputForm({ title, query, setTitle, setQuery }: Props) {
  return (
    <div className="panel form-grid">
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Decision title" />
      </label>
      <label>
        Query
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={8} placeholder="Describe the agenda..." />
      </label>
    </div>
  );
}
