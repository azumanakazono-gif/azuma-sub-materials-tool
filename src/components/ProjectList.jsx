import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';

const fmt = (v) => v != null ? '¥' + Math.abs(v).toLocaleString('ja-JP') : '—';

const STATUS_TABS = ['すべて', '進行中', '完了', '未着手'];
const CATEGORIES = ['すべてのカテゴリ', '新築（木造）', '増改築・リフォーム', '店舗・テナント'];

function SortIcon({ col, sortCol, sortDir }) {
  if (col !== sortCol) return <span className="material-symbols-outlined text-[14px] text-slate-300 ml-1">unfold_more</span>;
  return <span className="material-symbols-outlined text-[14px] text-blue-500 ml-1">{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>;
}

export default function ProjectList({ projects, onSelect }) {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('すべて');
  const [category, setCategory] = useState('すべてのカテゴリ');
  const [sortCol, setSortCol] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = [...projects];
    if (statusTab !== 'すべて') list = list.filter(p => p.status === statusTab);
    if (category !== 'すべてのカテゴリ') list = list.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [projects, statusTab, category, search, sortCol, sortDir]);

  return (
    <div>
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              type="text"
              placeholder="案件名・案件番号・施主で検索..."
              className="bg-transparent outline-none text-sm flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusTab === tab
                    ? 'bg-white text-slate-800 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('id')}>
                  案件No <SortIcon col="id" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 whitespace-nowrap">状態</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 whitespace-nowrap">ANDPAD案件名 / 施主</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 whitespace-nowrap">カテゴリ</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 whitespace-nowrap">営業</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('revenue')}>
                  電工部売上 <SortIcon col="revenue" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('cost')}>
                  実行原価 <SortIcon col="cost" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-500 cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort('budgetDiff')}>
                  予算差異 <SortIcon col="budgetDiff" sortCol={sortCol} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 whitespace-nowrap">利益率(想/実)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge s={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.client}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-600">{p.sales}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">{fmt(p.revenue)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">{p.cost > 0 ? fmt(p.cost) : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-xs font-semibold tabular-nums ${p.budgetDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {p.budgetDiff >= 0 ? '+' : '-'}{fmt(p.budgetDiff)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs tabular-nums">
                      <span className="text-slate-500">{p.profitRateEst.toFixed(1)}%</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className={`font-semibold ${p.profitRateAct > 0 ? (p.profitRateAct >= 20 ? 'text-emerald-600' : p.profitRateAct >= 10 ? 'text-amber-600' : 'text-red-600') : 'text-slate-300'}`}>
                        {p.profitRateAct > 0 ? p.profitRateAct.toFixed(1) + '%' : '—'}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    該当する案件がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400">
          {filtered.length}件表示 / 全{projects.length}件
        </div>
      </div>
    </div>
  );
}
