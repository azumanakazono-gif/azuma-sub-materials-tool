import {
  batchGetSheetValues,
  getSheetValues,
  appendSheetValues,
  setSheetValues,
  rowToProject,
  rowToOrderItem,
  orderItemToRow,
  SheetsApiError,
} from './sheetsApi.js';

// ── 財務計算 ─────────────────────────────────────────────────────────────────

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

// ── 環境変数 ─────────────────────────────────────────────────────────────────

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID ?? '';
const MASTER_RANGE   = import.meta.env.VITE_GOOGLE_SHEETS_RANGE        ?? '案件マスター!A2:J';
const ORDER_SHEET    = import.meta.env.VITE_GOOGLE_ORDER_SHEET_NAME     ?? '発注リスト';
const PLAN_SHEET     = import.meta.env.VITE_GOOGLE_PLAN_SHEET_NAME      ?? '着工予定リスト';

// 着工予定リストで実行原価を書く列（K 列 = index 10, 1-origin で 11 列目）
const PLAN_ACTUAL_COST_COL = 'K';

// ── Google Sheets API 連携 ────────────────────────────────────────────────────

/**
 * スプレッドシートから案件リスト（＋発注明細）を取得する。
 * - accessToken / SPREADSHEET_ID が未設定の場合は sampleData にフォールバック。
 * - batchGet で案件マスターと発注リストを 1 リクエストで取得。
 *
 * @param {string} [accessToken]
 * @returns {Promise<Array>}
 */
export async function fetchProjectsFromSheet(accessToken) {
  if (!accessToken || !SPREADSHEET_ID) {
    const { sampleProjects } = await import('../data/sampleData.js');
    return structuredClone(sampleProjects);
  }

  const [projectRows, itemRows] = await batchGetSheetValues(
    SPREADSHEET_ID,
    [MASTER_RANGE, `${ORDER_SHEET}!A2:G`],
    accessToken,
  );

  // 空行を除外してオブジェクトに変換
  const projects = projectRows
    .map(rowToProject)
    .filter(Boolean);

  // 発注明細を案件番号で紐付け
  const itemsByProject = {};
  itemRows.forEach((row, i) => {
    const item = rowToOrderItem(row, i);
    if (!item) return;
    (itemsByProject[item.projectId] ??= []).push(item);
  });
  projects.forEach(p => { p.items = itemsByProject[p.id] ?? []; });

  return projects;
}

/**
 * 発注リスト明細をスプレッドシートに追記する。
 * PUT（上書き）ではなく append エンドポイントを使うことでデータを末尾に追加する。
 *
 * @param {string}   projectId
 * @param {Array}    items  追記する明細オブジェクトの配列
 * @param {string}   accessToken
 * @returns {Promise<{updatedRows: number}>}
 */
export async function writeOrderItemsToSheet(projectId, items, accessToken) {
  assertConfig(accessToken, 'writeOrderItemsToSheet');
  const values = items.map(item => orderItemToRow(projectId, item));
  return appendSheetValues(SPREADSHEET_ID, `${ORDER_SHEET}!A:G`, values, accessToken);
}

/**
 * 実行原価（税抜）を着工予定リストの該当案件行に同期する。
 * 案件番号（A列）で行を特定し、PLAN_ACTUAL_COST_COL 列を上書きする。
 *
 * @param {string} projectId
 * @param {number} actualCostValue  税抜実行原価
 * @param {string} accessToken
 * @returns {Promise<{updatedRows: number, updatedCells: number}>}
 */
export async function syncActualCostToSheet(projectId, actualCostValue, accessToken) {
  assertConfig(accessToken, 'syncActualCostToSheet');

  // A 列のみ取得してインデックスを特定（全列取得より軽量）
  const idCol = await getSheetValues(SPREADSHEET_ID, `${PLAN_SHEET}!A2:A`, accessToken);
  const rowIndex = idCol.findIndex(r => r[0]?.trim() === projectId);
  if (rowIndex === -1) {
    throw new SheetsApiError(
      `syncActualCostToSheet: 案件 "${projectId}" が "${PLAN_SHEET}" に見つかりません`,
      404,
    );
  }

  const sheetRow = rowIndex + 2; // 1-indexed + ヘッダー行
  return setSheetValues(
    SPREADSHEET_ID,
    `${PLAN_SHEET}!${PLAN_ACTUAL_COST_COL}${sheetRow}`,
    [[String(actualCostValue)]],
    accessToken,
  );
}

// ── 内部ユーティリティ ────────────────────────────────────────────────────────

function assertConfig(accessToken, fnName) {
  if (!accessToken) throw new Error(`${fnName}: アクセストークンが未設定です`);
  if (!SPREADSHEET_ID) throw new Error(`${fnName}: VITE_GOOGLE_SPREADSHEET_ID が未設定です`);
}
