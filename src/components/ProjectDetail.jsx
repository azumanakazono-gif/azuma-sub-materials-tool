import { useState, useMemo } from 'react';
import Icon from './Icon';
import Money from './Money';
import Pct from './Pct';
import Donut from './Donut';
import StatusBadge from './StatusBadge';
import CatTag from './CatTag';
import H from '../utils/helpers';

function orderRows(items, group) {
  const withN = items.map((x, i) => ({ ...x, n: i + 1 }));
  if (group === 'vendor') {
    const groups = {};
    withN.forEach(x => { (groups[x.vendor] = groups[x.vendor] || []).push(x); });
    const out = [];
    Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0], 'ja'))
      .forEach(([v, arr]) => {
        const sum = arr.reduce((s, x) => s + x.qty * x.unit, 0);
        out.push({ group: `${v}（${arr.length}行 / 税抜 ¥${sum.toLocaleString()}）` });
        arr.forEach(x => out.push(x));
      });
    return out;
  }
  return withN;
}

export default function ProjectDetail({ project, role, onBack, onScan, recentIds }) {
  const [group, setGroup] = useState('date');
  const p = project;
  const act = H.actualCost(p);
  const inclTotal = H.actualInclTotal(p);
  const variance = H.costVariance(p);
  const over = variance < 0;
  const prof = H.profit(p);
  const mgn = H.margin(p);

  const byVendor = useMemo(() => {
    const m = {};
    p.items.forEach(x => { m[x.vendor] = (m[x.vendor] || 0) + x.qty * x.unit; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [p]);

  const recent = new Set(recentIds || []);

  return (
    <div className="page detail">
      <div className="detail-top">
        <button className="backbtn" onClick={onBack}>
          <Icon name="chevron" size={16} className="flip" />案件一覧
        </button>
        <div className="detail-head">
          <div className="detail-head-l">
            <span className="detail-no mono">{p.id}</span>
            <div>
              <div className="detail-name">{p.name}</div>
              <div className="detail-meta">
                <StatusBadge s={p.status} />
                <CatTag c={p.category} />
                <span className="dm">施主 <b>{p.client}</b></span>
                <span className="dm">営業 <b>{p.owner}</b></span>
                <span className="dm">着工 <b className="mono">{p.startDate || '—'}</b></span>
                <span className="dm">完工 <b className="mono">{p.kouki || '—'}</b></span>
              </div>
            </div>
          </div>
          {role && role.canScan
            ? <button className="btn btn-primary" onClick={onScan}><Icon name="scan" size={16} />この案件に納品書を取込</button>
            : <span className="ro-chip"><Icon name="alert" size={14} />閲覧専用モード</span>}
        </div>
      </div>

      <div className="pl-panel">
        <div className="pl-head"><Icon name="link" size={15} />着工予定リスト 予実管理（電気工事部）と連動</div>
        <div className="pl-grid">
          <div className="pl-cell">
            <span className="pl-lab">電工部 売上（税抜）</span>
            <Money v={p.deptSales} mark className="big" />
          </div>
          <div className="pl-cell">
            <span className="pl-lab">想定原価</span>
            <Money v={p.estCost} mark dim className="big" />
          </div>
          <div className="pl-cell hl">
            <span className="pl-lab">実行原価 ＝ 発注リスト小計</span>
            <Money v={act} mark className="big" />
            <span className="pl-note">税込 {Math.round(inclTotal).toLocaleString()} 円</span>
          </div>
          <div className="pl-cell">
            <span className="pl-lab">予算差異</span>
            <span className={over ? 'pillvar bad lg' : 'pillvar good lg'}><Money v={variance} sign /></span>
            <span className="pl-note">{over ? '想定超過' : '想定内'}</span>
          </div>
          <div className="pl-cell">
            <span className="pl-lab">貢献利益</span>
            <Money v={prof} mark className="big" />
          </div>
          <div className="pl-cell donutcell">
            <Donut v={mgn} size={56} />
            <div className="donutinfo">
              <span className="pl-lab">利益率（実績）</span>
              <Pct v={mgn} className="big" />
              <span className="pl-note">想定 {(H.estMargin(p) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="vendorbar">
        <span className="vendorbar-lab">取引先別</span>
        {byVendor.map(([v, amt]) => (
          <span key={v} className="vchip"><b>{v}</b><Money v={amt} /></span>
        ))}
        {byVendor.length === 0 && <span className="dim">まだ明細がありません。納品書を取込んでください。</span>}
      </div>

      <div className="listhead">
        <div className="listhead-l"><Icon name="list" size={16} />発注リスト明細<span className="rowcount">{p.items.length}行</span></div>
        <div className="seg sm">
          <button className={'seg-btn' + (group === 'date' ? ' on' : '')} onClick={() => setGroup('date')}>日付順</button>
          <button className={'seg-btn' + (group === 'vendor' ? ' on' : '')} onClick={() => setGroup('vendor')}>取引先別</button>
        </div>
      </div>

      <div className="tablewrap">
        <table className="dtable order">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th>伝票日付</th>
              <th>取引先</th>
              <th className="tl">品番・品名・機器（部材）名称・型式など</th>
              <th className="tr">数量</th>
              <th className="tr">単価(税抜)</th>
              <th className="tr">金額(税込)</th>
              <th>発注担当</th>
            </tr>
          </thead>
          <tbody>
            {orderRows(p.items, group).map((r, i) =>
              r.group ? (
                <tr key={'g' + i} className="grouprow"><td></td><td colSpan={7} className="tl">{r.group}</td></tr>
              ) : (
                <tr key={r.id} className={recent.has(r.id) ? 'newrow' : ''}>
                  <td className="mono dim tc">{r.n}</td>
                  <td className="mono">{r.date}</td>
                  <td>{r.vendor}</td>
                  <td className="tl item">{r.name}{recent.has(r.id) && <span className="newtag">NEW</span>}</td>
                  <td className="tr mono">{r.qty}</td>
                  <td className="tr"><Money v={r.unit} /></td>
                  <td className="tr"><Money v={r.qty * r.unit * 1.1} /></td>
                  <td className="owner">{r.owner || '—'}</td>
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr className="subtotal">
              <td colSpan={4} className="tr">小計</td>
              <td></td>
              <td className="tr lab">税抜</td>
              <td className="tr"><Money v={act} mark /></td>
              <td></td>
            </tr>
            <tr className="subtotal">
              <td colSpan={4} className="tr"></td>
              <td></td>
              <td className="tr lab">税込</td>
              <td className="tr"><Money v={inclTotal} mark /></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="tablefoot">
        この小計（税抜）が着工予定リストの「電気工事部 実行原価」に自動連携されます
      </div>
    </div>
  );
}
