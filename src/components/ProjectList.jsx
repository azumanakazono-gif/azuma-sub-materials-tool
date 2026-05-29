import Icon from './Icon';
import Money from './Money';
import StatusBadge from './StatusBadge';
import CatTag from './CatTag';
import H from '../utils/helpers';

export default function ProjectList({ projects, onSelect }) {
  return (
    <div className="page list-page">
      <div className="listpage-head">
        <div className="listpage-title">
          <Icon name="building" size={20} />
          <span>副資材発注リスト管理ツール</span>
          <span className="listpage-sub">アズマ電気工事部</span>
        </div>
        <button className="btn btn-primary">
          <Icon name="plus" size={16} />新規案件
        </button>
      </div>

      <div className="search-bar">
        <Icon name="search" size={16} className="search-icon" />
        <input type="text" placeholder="案件名・案件番号・施主で検索…" className="search-input" readOnly />
      </div>

      <div className="proj-table-wrap">
        <table className="dtable">
          <thead>
            <tr>
              <th>案件番号</th>
              <th className="tl">案件名</th>
              <th>ステータス</th>
              <th>区分</th>
              <th>施主</th>
              <th>担当</th>
              <th className="tr">売上（税抜）</th>
              <th className="tr">実行原価（税抜）</th>
              <th className="tr">利益率</th>
              <th>着工</th>
              <th>完工</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => {
              const mgn = H.margin(p);
              return (
                <tr key={p.id} className="proj-row" onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
                  <td className="mono">{p.id}</td>
                  <td className="tl proj-name">{p.name}</td>
                  <td><StatusBadge s={p.status} /></td>
                  <td><CatTag c={p.category} /></td>
                  <td>{p.client}</td>
                  <td>{p.owner}</td>
                  <td className="tr"><Money v={p.deptSales} mark /></td>
                  <td className="tr"><Money v={H.actualCost(p)} mark /></td>
                  <td className="tr">
                    <span className={mgn >= 0.2 ? 'pct-good' : mgn >= 0.1 ? 'pct-warn' : 'pct-bad'}>
                      {(mgn * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="mono">{p.startDate || '—'}</td>
                  <td className="mono">{p.kouki || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
