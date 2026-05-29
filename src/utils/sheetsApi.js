/**
 * Google Sheets API v4 fetch ラッパー
 *
 * 列マッピング（シート仕様）
 * ─ 案件マスター: A=案件番号 B=案件名 C=ステータス D=区分
 *                 E=施主 F=担当 G=着工日 H=完工日 I=売上(税抜) J=想定原価
 * ─ 発注リスト:   A=案件番号 B=伝票日付 C=取引先 D=品名
 *                 E=数量 F=単価(税抜) G=発注担当
 * ─ 着工予定リスト: A=案件番号 … K=実行原価(税抜)
 */

const BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

// ── エラークラス ─────────────────────────────────────────────────────────────

export class SheetsApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'SheetsApiError';
    this.status = status;
  }
  get isAuthError()    { return this.status === 401 || this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isQuotaExceeded(){ return this.status === 429; }
}

// ── 内部ヘルパー ─────────────────────────────────────────────────────────────

async function apiFetch(url, accessToken, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (res.ok) return res;

  let message = res.statusText;
  try {
    const body = await res.json();
    message = body?.error?.message ?? message;
  } catch { /* ignore */ }
  throw new SheetsApiError(`Sheets API [${res.status}]: ${message}`, res.status);
}

// ── 読み取り ─────────────────────────────────────────────────────────────────

/**
 * 単一範囲の値を取得する。
 * @param {string}   spreadsheetId
 * @param {string}   range  A1記法（例: '案件マスター!A2:J'）
 * @param {string}   accessToken
 * @returns {Promise<string[][]>}
 */
export async function getSheetValues(spreadsheetId, range, accessToken) {
  const url = `${BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await apiFetch(url, accessToken);
  const data = await res.json();
  return data.values ?? [];
}

/**
 * 複数範囲を 1 リクエストで取得する（batchGet）。
 * @param {string}   spreadsheetId
 * @param {string[]} ranges  A1記法の配列
 * @param {string}   accessToken
 * @returns {Promise<string[][][]>}  ranges と同順の2次元配列の配列
 */
export async function batchGetSheetValues(spreadsheetId, ranges, accessToken) {
  const params = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
  const url = `${BASE}/${spreadsheetId}/values:batchGet?${params}`;
  const res  = await apiFetch(url, accessToken);
  const data = await res.json();
  return (data.valueRanges ?? []).map(vr => vr.values ?? []);
}

// ── 書き込み ─────────────────────────────────────────────────────────────────

/**
 * 指定範囲を上書きする（既存データの更新用）。
 * @param {string}     spreadsheetId
 * @param {string}     range
 * @param {string[][]} values
 * @param {string}     accessToken
 * @returns {Promise<{updatedRows: number, updatedCells: number}>}
 */
export async function setSheetValues(spreadsheetId, range, values, accessToken) {
  const url =
    `${BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}` +
    '?valueInputOption=USER_ENTERED';
  const res  = await apiFetch(url, accessToken, {
    method: 'PUT',
    body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
  });
  const data = await res.json();
  return { updatedRows: data.updatedRows ?? 0, updatedCells: data.updatedCells ?? 0 };
}

/**
 * データ末尾に行を追記する（新規明細の追加用）。
 * @param {string}     spreadsheetId
 * @param {string}     range  追記対象シートの範囲（例: '発注リスト!A:G'）
 * @param {string[][]} values
 * @param {string}     accessToken
 * @returns {Promise<{updatedRows: number}>}
 */
export async function appendSheetValues(spreadsheetId, range, values, accessToken) {
  const url =
    `${BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:append` +
    '?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS';
  const res  = await apiFetch(url, accessToken, {
    method: 'POST',
    body: JSON.stringify({ majorDimension: 'ROWS', values }),
  });
  const data = await res.json();
  return { updatedRows: data.updates?.updatedRows ?? 0 };
}

/**
 * 複数範囲を 1 リクエストで更新する（batchUpdate）。
 * @param {string}   spreadsheetId
 * @param {Array<{range: string, values: string[][]}>} updates
 * @param {string}   accessToken
 */
export async function batchSetSheetValues(spreadsheetId, updates, accessToken) {
  const url = `${BASE}/${spreadsheetId}/values:batchUpdate`;
  await apiFetch(url, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updates.map(u => ({ range: u.range, majorDimension: 'ROWS', values: u.values })),
    }),
  });
}

/**
 * 指定範囲をクリアする。
 * @param {string} spreadsheetId
 * @param {string} range
 * @param {string} accessToken
 */
export async function clearSheetRange(spreadsheetId, range, accessToken) {
  const url = `${BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
  await apiFetch(url, accessToken, { method: 'POST', body: '{}' });
}

// ── 行変換 ───────────────────────────────────────────────────────────────────

/** 空行（全カラムが空文字）を除外する */
function isEmptyRow(row) {
  return !row || row.every(c => c === '' || c == null);
}

/**
 * 案件マスターの行 → プロジェクトオブジェクト
 * @param {string[]} row
 * @returns {Object|null}  空行の場合 null
 */
export function rowToProject(row) {
  if (isEmptyRow(row) || !row[0]) return null;
  return {
    id:        row[0].trim(),
    name:      row[1]?.trim() ?? '',
    status:    row[2]?.trim() ?? 'planning',
    category:  row[3]?.trim() ?? '',
    client:    row[4]?.trim() ?? '',
    owner:     row[5]?.trim() ?? '',
    startDate: row[6]?.trim() ?? '',
    kouki:     row[7]?.trim() ?? '',
    deptSales: parseNum(row[8]),
    estCost:   parseNum(row[9]),
    items:     [],
  };
}

/**
 * 発注リストの行 → 明細オブジェクト
 * @param {string[]} row
 * @param {number}   index  行番号（id生成用）
 * @returns {Object|null}  空行の場合 null
 */
export function rowToOrderItem(row, index) {
  if (isEmptyRow(row) || !row[0]) return null;
  const qty  = parseNum(row[4]);
  const unit = parseNum(row[5]);
  return {
    id:        `sheet-${index}`,
    projectId: row[0].trim(),
    date:      row[1]?.trim() ?? '',
    vendor:    row[2]?.trim() ?? '',
    name:      row[3]?.trim() ?? '',
    qty,
    unit,
    amtIncl:   qty * unit * 1.1,
    owner:     row[6]?.trim() ?? '',
  };
}

/**
 * 明細オブジェクト → 発注リストシートの行配列
 * @param {string} projectId
 * @param {Object} item
 * @returns {string[]}
 */
export function orderItemToRow(projectId, item) {
  return [
    projectId,
    item.date      ?? '',
    item.vendor    ?? '',
    item.name      ?? '',
    String(item.qty  ?? 0),
    String(item.unit ?? 0),
    item.owner     ?? '',
  ];
}

// ── 内部ユーティリティ ───────────────────────────────────────────────────────

/** カンマ付き数値文字列も含めて安全に数値変換する */
function parseNum(v) {
  if (v == null || v === '') return 0;
  return Number(String(v).replace(/,/g, '')) || 0;
}
