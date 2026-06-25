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
  if (p.cost != null && !p.items?.length) return p.cost;
  return p.items?.reduce((s, x) => s + x.qty * x.unit, 0) ?? 0;
}

export function actualInclTotal(p) {
  return p.items?.reduce((s, x) => s + x.qty * x.unit * (1 + TAX_RATE), 0) ?? 0;
}

export function costVariance(p) {
  return (p.revenue ?? p.estCost ?? 0) - actualCost(p);
}

export function profit(p) {
  return (p.revenue ?? p.deptSales ?? 0) - actualCost(p);
}

export function margin(p) {
  const sales = p.revenue ?? p.deptSales ?? 0;
  if (!sales) return 0;
  return profit(p) / sales;
}

export function estMargin(p) {
  const sales = p.revenue ?? p.deptSales ?? 0;
  if (!sales) return 0;
  const est = p.cost ?? p.estCost ?? 0;
  return (sales - est) / sales;
}

const helpers = { actualCost, actualInclTotal, costVariance, profit, margin, estMargin };
export default helpers;

// ── 環境変数 ─────────────────────────────────────────────────────────────────

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID ?? '';
const MASTER_RANGE   = import.meta.env.VITE_GOOGLE_SHEETS_RANGE        ?? '案件マスター!A2:J';
const ORDER_SHEET    = import.meta.env.VITE_GOOGLE_ORDER_SHEET_NAME     ?? '発注リスト';
const PLAN_SHEET     = import.meta.env.VITE_GOOGLE_PLAN_SHEET_NAME      ?? '着工予定リスト';

const PLAN_ACTUAL_COST_COL = 'K';

// ── Google Sheets API 連携 ────────────────────────────────────────────────────

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

  const projects = projectRows
    .map(rowToProject)
    .filter(Boolean);

  const itemsByProject = {};
  itemRows.forEach((row, i) => {
    const item = rowToOrderItem(row, i);
    if (!item) return;
    (itemsByProject[item.projectId] ??= []).push(item);
  });
  projects.forEach(p => { p.items = itemsByProject[p.id] ?? []; });

  return projects;
}

export async function writeOrderItemsToSheet(projectId, items, accessToken) {
  assertConfig(accessToken, 'writeOrderItemsToSheet');
  const values = items.map(item => orderItemToRow(projectId, item));
  return appendSheetValues(SPREADSHEET_ID, `${ORDER_SHEET}!A:G`, values, accessToken);
}

export async function syncActualCostToSheet(projectId, actualCostValue, accessToken) {
  assertConfig(accessToken, 'syncActualCostToSheet');

  const idCol = await getSheetValues(SPREADSHEET_ID, `${PLAN_SHEET}!A2:A`, accessToken);
  const rowIndex = idCol.findIndex(r => r[0]?.trim() === projectId);
  if (rowIndex === -1) {
    throw new SheetsApiError(
      `syncActualCostToSheet: 案件 "${projectId}" が "${PLAN_SHEET}" に見つかりません`,
      404,
    );
  }

  const sheetRow = rowIndex + 2;
  return setSheetValues(
    SPREADSHEET_ID,
    `${PLAN_SHEET}!${PLAN_ACTUAL_COST_COL}${sheetRow}`,
    [[String(actualCostValue)]],
    accessToken,
  );
}

function assertConfig(accessToken, fnName) {
  if (!accessToken) throw new Error(`${fnName}: アクセストークンが未設定です`);
  if (!SPREADSHEET_ID) throw new Error(`${fnName}: VITE_GOOGLE_SPREADSHEET_ID が未設定です`);
}
