import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'projects', icon: 'list_alt', label: '案件一覧・予実', badge: null },
  { id: 'scan', icon: 'document_scanner', label: '納品書スキャン取込', badge: '3' },
  { id: 'schedule', icon: 'calendar_month', label: '着工予定リスト', badge: null },
  { id: 'inventory', icon: 'inventory_2', label: '在庫・工具', badge: null },
  { id: 'report', icon: 'bar_chart', label: '原価レポート', badge: null },
];

export default function Sidebar({ activeNav = 'projects', onNavChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col bg-slate-950 text-slate-300 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} min-h-screen`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-800">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-sm flex-shrink-0">AZ</span>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate leading-tight">アズマ電気工事部</span>
            <span className="text-[10px] text-slate-500 leading-tight">副資材発注管理</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = item.id === activeNav;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange?.(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-teal-600/20 text-teal-400 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sync Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            Google Sheets 同期中
          </div>
          <div className="text-[10px] text-slate-600 mt-1">最終同期: 2025-06-10 14:32</div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-slate-800 hover:bg-slate-800 transition-colors"
      >
        <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform ${collapsed ? 'rotate-180' : ''}`}>
          chevron_left
        </span>
      </button>
    </aside>
  );
}
