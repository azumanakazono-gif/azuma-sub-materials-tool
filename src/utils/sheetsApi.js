/**
 * Google Sheets API v4 ラッパー
 * アクセストークンは @react-oauth/google の useGoogleLogin で取得したものを渡す。
 */

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * スプレッドシートの指定範囲を取得する。
 * @param {string} spreadsheetId
 * @param {string} range  A1記法（例: '案件マスター!A2:J'）
 * @param {string} accessToken
 * @returns {Promise<string[][]>}  値の2次元配列（行 × 列）
 */
export async function getSheetValues(spreadsheetId, range, accessToken) {
  const url = `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Sheets API エラー [${res.status}]: ${err?.error?.message ?? res.statusText}`);
  }
  const data = await res.json();
  return data.values ?? [];
}

/**
 * スプレッドシートの指定範囲に値を書き込む（上書き）。
 * @param {string}   spreadsheetId
 * @param {string}   range  書き込み先（例: '発注リスト!A2'）
 * @param {string[][]} values  書き込む2次元配列
 * @param {string}   accessToken
 */
export async function setSheetValues(spreadsheetId, range, values, accessToken) {
  const url =
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}` +
    '?valueInputOption=USER_ENTERED';
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Sheets API 書き込みエラー [${res.status}]: ${err?.error?.message ?? res.statusText}`);
  }
}

// ── 列マッピング定義 ──────────────────────────────────────────────────────
// 案件マスターシート: A=案件番号 B=案件名 C=ステータス D=区分
//                    E=施主 F=担当 G=着工日 H=完工日 I=売上(税抜) J=想定原価

/**
 * シート行（文字列配列）→ プロジェクトオブジェクト に変換する。
 * @param {string[]} row
 * @returns {Object}
 */
export function rowToProject(row) {
  return {
    id:         row[0] ?? '',
    name:       row[1] ?? '',
    status:     row[2] ?? 'planning',
    category:   row[3] ?? '',
    client:     row[4] ?? '',
    owner:      row[5] ?? '',
    startDate:  row[6] ?? '',
    kouki:      row[7] ?? '',
    deptSales:  Number(row[8] ?? 0),
    estCost:    Number(row[9] ?? 0),
    items: [],
  };
}

// 発注リストシート: A=案件番号 B=伝票日付 C=取引先 D=品名
//                  E=数量 F=単価(税抜) G=発注担当

/**
 * 発注リスト行（文字列配列）→ 明細オブジェクト に変換する。
 * @param {string[]} row
 * @param {number}   index  行番号（id生成用）
 * @returns {Object}
 */
export function rowToOrderItem(row, index) {
  const qty  = Number(row[4] ?? 0);
  const unit = Number(row[5] ?? 0);
  return {
    id:      `sheet-${index}`,
    projectId: row[0] ?? '',
    date:    row[1] ?? '',
    vendor:  row[2] ?? '',
    name:    row[3] ?? '',
    qty,
    unit,
    amtIncl: qty * unit * 1.1,
    owner:   row[6] ?? '',
  };
}

/**
 * 明細オブジェクト → 発注リストシートの行配列 に変換する。
 * @param {string} projectId
 * @param {Object} item
 * @returns {string[]}
 */
export function orderItemToRow(projectId, item) {
  return [
    projectId,
    item.date,
    item.vendor,
    item.name,
    String(item.qty),
    String(item.unit),
    item.owner ?? '',
  ];
}
