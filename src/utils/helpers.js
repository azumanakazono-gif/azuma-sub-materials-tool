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

// ── Google Sheets API 連携（プレースホルダー） ──────────────────────────

/**
 * スプレッドシートから案件リストを取得する。
 * @param {string} _spreadsheetId  対象スプレッドシートID
 * @param {string} _range          取得範囲（例: 'Sheet1!A2:Z'）
 * @returns {Promise<Array>}       案件オブジェクトの配列
 */
export async function fetchProjectsFromSheet(_spreadsheetId, _range) {
  throw new Error('fetchProjectsFromSheet: 未実装 — Google Sheets API 連携を実装してください');
}

/**
 * 発注リスト明細をスプレッドシートに書き出す。
 * @param {string} _spreadsheetId  対象スプレッドシートID
 * @param {string} _range          書き込み先範囲（例: 'Sheet1!A2'）
 * @param {Array}  _rows           書き込む行データ
 * @returns {Promise<void>}
 */
export async function writeOrderItemsToSheet(_spreadsheetId, _range, _rows) {
  throw new Error('writeOrderItemsToSheet: 未実装 — Google Sheets API 連携を実装してください');
}

/**
 * 予実データ（実行原価）を着工予定リストのシートに同期する。
 * @param {string} _spreadsheetId  対象スプレッドシートID
 * @param {string} _projectId      案件番号（行の特定に使用）
 * @param {number} _actualCost     実行原価（税抜）
 * @returns {Promise<void>}
 */
export async function syncActualCostToSheet(_spreadsheetId, _projectId, _actualCost) {
  throw new Error('syncActualCostToSheet: 未実装 — Google Sheets API 連携を実装してください');
}

/**
 * Google OAuth2 トークンを取得・更新する。
 * @returns {Promise<string>}  アクセストークン
 */
export async function getGoogleAccessToken() {
  throw new Error('getGoogleAccessToken: 未実装 — OAuth2 認証フローを実装してください');
}
