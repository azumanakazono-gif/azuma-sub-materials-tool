const STATUS_STYLES = {
  '完了':   'bg-slate-100 text-slate-600',
  '進行中': 'bg-blue-100 text-blue-700',
  '未着手': 'bg-amber-100 text-amber-700',
};

export default function StatusBadge({ s }) {
  const cls = STATUS_STYLES[s] || 'bg-slate-100 text-slate-500';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${cls}`}>
      {s}
    </span>
  );
}
