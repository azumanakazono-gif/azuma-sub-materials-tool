const TAX_RATE = 0.1;

export function actualCost(p) {
  return p.items.reduce((s, x) => s + x.qty * x.unit, 0);
}

export function actualInclTotal(p) {
  return p.items.reduce((s, x) => s + x.qty * x.unit * (1 + TAX_RATE), 0);
}

export function costVariance(p) {
  return p.estCost - actualCost(p);
}

export function profit(p) {
  return p.deptSales - actualCost(p);
}

export function margin(p) {
  if (!p.deptSales) return 0;
  return profit(p) / p.deptSales;
}

export function estMargin(p) {
  if (!p.deptSales) return 0;
  return (p.deptSales - p.estCost) / p.deptSales;
}

const helpers = { actualCost, actualInclTotal, costVariance, profit, margin, estMargin };
export default helpers;

// ── Google Sheets API 連携 ────────────────────────────────────────────────

import {
  getSheetValues,
  setSheetValues,
  rowToProject,
  rowToOrderItem,
  orderItemToRow,
} from './sheetsApi.js';

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const SHEETS_RANGE   = import.meta.env.VITE_GOOGLE_SHEETS_RANGE ?? '案件マスター!A2:J';
const ORDER_SHEET    = import.meta.env.VITE_GOOGLE_ORDER_SHEET_NAME ?? '発注リスト';
const PLAN_SHEET     = import.meta.env.VITE_GOOGLE_PLAN_SHEET_NAME  ?? '着工予定リスト';

/**
 * スプレッドシートから案件リストを取得する。
 * accessToken が未指定の場合は sampleData にフォールバックする（開発用）。
 * @param {string} [accessToken]
 * @returns {Promise<Array>}
 */
export async function fetchProjectsFromSheet(accessToken) {
  if (!accessToken || !SPREADSHEET_ID) {
    const { sampleProjects } = await import('../data/sampleData.js');
    return structuredClone(sampleProjects);
  }

  const [projectRows, itemRows] = await Promise.all([
    getSheetValues(SPREADSHEET_ID, SHEETS_RANGE, accessToken),
    getSheetValues(SPREADSHEET_ID, `${ORDER_SHEET}!A2:G`, accessToken),
  ]);

  const projects = projectRows.map(rowToProject);

  // 発注明細を案件番号で紐付け
  const itemsByProject = {};
  itemRows.forEach((row, i) => {
    const item = rowToOrderItem(row, i);
    if (!itemsByProject[item.projectId]) itemsByProject[item.projectId] = [];
    itemsByProject[item.projectId].push(item);
  });
  projects.forEach(p => { p.items = itemsByProject[p.id] ?? []; });

  return projects;
}

/**
 * 発注リスト明細をスプレッドシートに追記する。
 * @param {string}   projectId
 * @param {Array}    items
 * @param {string}   accessToken
 */
export async function writeOrderItemsToSheet(projectId, items, accessToken) {
  if (!accessToken || !SPREADSHEET_ID) {
    throw new Error('writeOrderItemsToSheet: アクセストークンまたはSPREADSHEET_IDが未設定です');
  }
  const values = items.map(item => orderItemToRow(projectId, item));
  // 既存末尾に追記（A:G の最終行以降に書き込む）
  await setSheetValues(SPREADSHEET_ID, `${ORDER_SHEET}!A2`, values, accessToken);
}

/**
 * 実行原価を着工予定リストの該当案件行に同期する。
 * @param {string} projectId
 * @param {number} actualCostValue  税抜実行原価
 * @param {string} accessToken
 */
export async function syncActualCostToSheet(projectId, actualCostValue, accessToken) {
  if (!accessToken || !SPREADSHEET_ID) {
    throw new Error('syncActualCostToSheet: アクセストークンまたはSPREADSHEET_IDが未設定です');
  }
  // 着工予定リストで projectId が一致する行を検索して実行原価列を更新
  const rows = await getSheetValues(SPREADSHEET_ID, `${PLAN_SHEET}!A2:Z`, accessToken);
  const rowIndex = rows.findIndex(r => r[0] === projectId);
  if (rowIndex === -1) throw new Error(`syncActualCostToSheet: 案件 ${projectId} が ${PLAN_SHEET} に見つかりません`);
  // 実行原価は K 列（index 10）に書き込む想定
  const sheetRow = rowIndex + 2; // 1-indexed + ヘッダー分
  await setSheetValues(SPREADSHEET_ID, `${PLAN_SHEET}!K${sheetRow}`, [[String(actualCostValue)]], accessToken);
}
