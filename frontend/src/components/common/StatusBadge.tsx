type Props = { value: string };

export function StatusBadge({ value }: Props) {
  return <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>;
}
