const STATUS_MAP = {
  active:    { label: '施工中', cls: 'badge-active' },
  completed: { label: '完了',   cls: 'badge-completed' },
  planning:  { label: '計画中', cls: 'badge-planning' },
  on_hold:   { label: '保留',   cls: 'badge-hold' },
};

export default function StatusBadge({ s }) {
  const { label, cls } = STATUS_MAP[s] || { label: s, cls: '' };
  return <span className={`status-badge ${cls}`}>{label}</span>;
}
