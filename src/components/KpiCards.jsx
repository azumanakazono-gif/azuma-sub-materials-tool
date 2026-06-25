const fmt = (v) => '¥' + Math.abs(v).toLocaleString('ja-JP');

export default function KpiCards({ projects }) {
  const active = projects.filter(p => p.status === '進行中');
  const activeCount = active.length;
  const totalRevenue = projects.reduce((s, p) => s + p.revenue, 0);
  const totalCost = projects.reduce((s, p) => s + p.cost, 0);
  const budgetDiff = totalRevenue - totalCost;

  const cards = [
    {
      icon: 'trending_up',
      iconBg: 'bg-blue-100 text-blue-600',
      label: '進行中案件',
      value: `${activeCount}件`,
      sub: `全${projects.length}件中`,
    },
    {
      icon: 'account_balance',
      iconBg: 'bg-emerald-100 text-emerald-600',
      label: '想定原価合計',
      value: fmt(totalRevenue),
      sub: '進行中＋完了',
    },
    {
      icon: 'receipt_long',
      iconBg: 'bg-amber-100 text-amber-600',
      label: '実行原価合計',
      value: fmt(totalCost),
      sub: '発注リスト累計',
    },
    {
      icon: 'savings',
      iconBg: 'bg-teal-100 text-teal-600',
      label: '予算差異',
      value: (budgetDiff >= 0 ? '+' : '-') + fmt(budgetDiff),
      sub: budgetDiff >= 0 ? '予算内' : '予算超過',
      valueCls: budgetDiff >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className={`material-symbols-outlined text-[22px] p-2 rounded-lg ${c.iconBg}`}>{c.icon}</span>
            <span className="text-xs text-slate-500 font-medium">{c.label}</span>
          </div>
          <div className={`text-xl font-bold ${c.valueCls || 'text-slate-800'}`}>{c.value}</div>
          <div className="text-[11px] text-slate-400 mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
