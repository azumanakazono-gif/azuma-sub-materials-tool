import { useState, useRef } from 'react';
import Icon from './Icon';
import Money from './Money';
import { extractOrderItemsFromImage } from '../utils/ocrApi';

const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

// モック: extractOrderItemsFromImage が未実装の間、ダミーデータを返す
async function runOcr(file, options) {
  try {
    return await extractOrderItemsFromImage(file, options);
  } catch {
    // TODO: OCR API 実装後はこのフォールバックを削除する
    await new Promise(r => setTimeout(r, 1400)); // 読取中の演出
    return [
      { date: '2024-06-01', vendor: options.vendor || '松下電工商事', name: 'CV3.5sq×3C 600Vケーブル', qty: 50, unit: 1200, owner: '' },
      { date: '2024-06-01', vendor: options.vendor || '松下電工商事', name: '電線管（PF管）28φ×4m',    qty: 20, unit:  800, owner: '' },
      { date: '2024-06-01', vendor: options.vendor || '松下電工商事', name: '埋込コンセント2P15A',      qty: 10, unit:  350, owner: '' },
    ];
  }
}

export default function InvoiceUpload({ project, onClose, onImport }) {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [status, setStatus]       = useState('idle'); // idle | reading | done | error
  const [items, setItems]         = useState([]);
  const [errMsg, setErrMsg]       = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const inputRef = useRef();

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setItems([]);
    setErrMsg('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null); // PDF はプレビュー非対応
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleRead() {
    if (!file) return;
    setStatus('reading');
    setErrMsg('');
    try {
      const result = await runOcr(file, { projectId: project.id });
      setItems(result);
      setStatus('done');
    } catch (e) {
      setErrMsg(e.message);
      setStatus('error');
    }
  }

  function handleImport() {
    onImport(items);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* ヘッダー */}
        <div className="modal-head">
          <div className="modal-title">
            <Icon name="scan" size={17} />
            納品書を取込 — <span className="mono">{project.id}</span> {project.name}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* ドロップゾーン */}
        <div
          className={`dropzone${dragOver ? ' over' : ''}${file ? ' has-file' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="dropzone-info">
              {preview
                ? <img src={preview} alt="プレビュー" className="img-preview" />
                : <div className="pdf-placeholder"><Icon name="list" size={32} /></div>}
              <div className="file-name">{file.name}</div>
              <div className="file-size dim">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          ) : (
            <div className="dropzone-empty">
              <Icon name="scan" size={36} className="dim" />
              <div>ここに納品書をドロップ</div>
              <div className="dim" style={{ fontSize: 12 }}>または クリックして選択（JPEG / PNG / PDF）</div>
            </div>
          )}
        </div>

        {/* 読取ボタン */}
        {file && status !== 'done' && (
          <div style={{ textAlign: 'right', marginTop: 12 }}>
            <button
              className="btn btn-primary"
              onClick={handleRead}
              disabled={status === 'reading'}
            >
              {status === 'reading'
                ? <><span className="spinner" />OCR 読取中…</>
                : <><Icon name="scan" size={15} />OCR 読取開始</>}
            </button>
          </div>
        )}

        {/* エラー */}
        {status === 'error' && (
          <div className="ocr-error">⚠ {errMsg}</div>
        )}

        {/* 読取結果 */}
        {status === 'done' && items.length > 0 && (
          <div className="ocr-result">
            <div className="ocr-result-head">
              <Icon name="list" size={15} />
              読取結果 — {items.length} 行
              <span className="dim" style={{ fontSize: 11, marginLeft: 6 }}>※ 内容を確認して取込んでください</span>
            </div>
            <div className="tablewrap" style={{ maxHeight: 240 }}>
              <table className="dtable">
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>取引先</th>
                    <th className="tl">品名</th>
                    <th className="tr">数量</th>
                    <th className="tr">単価(税抜)</th>
                    <th className="tr">金額(税抜)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="mono">{item.date}</td>
                      <td>{item.vendor}</td>
                      <td className="tl item">{item.name}</td>
                      <td className="tr mono">{item.qty}</td>
                      <td className="tr"><Money v={item.unit} /></td>
                      <td className="tr"><Money v={item.qty * item.unit} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: 'right', marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" style={{ background: '#f1f5f9', color: '#475569' }} onClick={() => setStatus('idle')}>
                やり直す
              </button>
              <button className="btn btn-primary" onClick={handleImport}>
                <Icon name="plus" size={15} />この内容で発注リストに取込
              </button>
            </div>
          </div>
        )}

        {status === 'done' && items.length === 0 && (
          <div className="ocr-error">明細が読み取れませんでした。画像を確認してください。</div>
        )}
      </div>
    </div>
  );
}
