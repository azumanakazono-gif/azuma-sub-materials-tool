import { useState, useEffect, useCallback } from 'react';
import { googleLogout } from '@react-oauth/google';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import InvoiceUpload from './components/InvoiceUpload';
import GoogleLoginButton from './components/GoogleLoginButton';
import { fetchProjectsFromSheet } from './utils/helpers';

// oauthEnabled: main.jsx が GoogleOAuthProvider でラップした場合のみ true
export default function App({ oauthEnabled = false }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo]       = useState(null);
  const [projects, setProjects]       = useState([]);
  const [selected, setSelected]       = useState(null);
  const [scanning, setScanning]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const role = { canScan: !!accessToken };

  const loadProjects = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjectsFromSheet(token);
      setProjects(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(null); }, [loadProjects]);

  const handleLoginSuccess = useCallback(async (tokenResponse) => {
    const token = tokenResponse.access_token;
    setAccessToken(token);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(await res.json());
    } catch { /* ユーザー情報取得失敗は無視 */ }
    await loadProjects(token);
  }, [loadProjects]);

  const handleLoginError = useCallback((err) => {
    setError(`Googleログインに失敗しました: ${err.error ?? '不明なエラー'}`);
  }, []);

  const logout = useCallback(() => {
    googleLogout();
    setAccessToken(null);
    setUserInfo(null);
    loadProjects(null);
  }, [loadProjects]);

  const handleImport = useCallback((newItems) => {
    const stamp = () => newItems.map((item, i) => ({ ...item, id: `ocr-${Date.now()}-${i}` }));
    setProjects(prev => prev.map(p =>
      p.id === selected.id ? { ...p, items: [...p.items, ...stamp()] } : p
    ));
    setSelected(prev => ({ ...prev, items: [...prev.items, ...stamp()] }));
    setScanning(false);
  }, [selected]);

  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-logo">⚡ AZ</span>
        <span className="app-title">副資材発注リスト管理ツール</span>
        <span className="app-corp">アズマ電気工事部</span>
        <div className="header-spacer" />

        {/* ── 認証状態によってヘッダー右端を切り替え ── */}
        {oauthEnabled ? (
          accessToken ? (
            <div className="auth-info">
              <span className="header-user">{userInfo?.name ?? 'ログイン中'}</span>
              <button className="btn-logout" onClick={logout}>ログアウト</button>
            </div>
          ) : (
            // GoogleLoginButton は GoogleOAuthProvider 内でのみ使用可能
            <GoogleLoginButton
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          )
        ) : (
          // OAuth 未設定 → デモモード表示（クラッシュしない）
          <span className="demo-chip">📋 デモモード（サンプルデータ）</span>
        )}
      </header>

      {error && <div className="error-banner">⚠ {error}</div>}

      <main className="app-main">
        {loading ? (
          <div className="loading">読み込み中…</div>
        ) : selected ? (
          <ProjectDetail
            project={selected}
            role={role}
            onBack={() => setSelected(null)}
            onScan={() => setScanning(true)}
          />
        ) : (
          <ProjectList projects={projects} onSelect={setSelected} />
        )}

        {scanning && selected && (
          <InvoiceUpload
            project={selected}
            onClose={() => setScanning(false)}
            onImport={handleImport}
          />
        )}
      </main>
    </div>
  );
}
