/**
 * OCR 読取 API ラッパー
 * 納品書画像から発注明細を抽出する。
 * TODO: 実装時は Google Cloud Vision API / Azure Document Intelligence 等に差し替える。
 */

/**
 * 画像ファイルから発注明細を抽出する。
 * @param {File}   imageFile  アップロードされた画像または PDF ファイル
 * @param {Object} [options]
 * @param {string} [options.vendor]     取引先名（既知の場合はヒントとして渡す）
 * @param {string} [options.projectId]  案件番号（紐付け用）
 * @returns {Promise<Array<{
 *   date:   string,
 *   vendor: string,
 *   name:   string,
 *   qty:    number,
 *   unit:   number,
 *   owner:  string,
 * }>>}  抽出された明細の配列
 */
export async function extractOrderItemsFromImage(imageFile, options = {}) {
  // TODO: OCR API 実装後はここを差し替える
  throw new Error(
    'extractOrderItemsFromImage: 未実装 — OCR API（Cloud Vision / Document Intelligence 等）を接続してください'
  );
}
