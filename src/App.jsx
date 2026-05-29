import { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import { fetchProjectsFromSheet } from './utils/helpers';

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo]       = useState(null);
  const [projects, setProjects]       = useState([]);
  const [selected, setSelected]       = useState(null);
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

  // 初回（未ログイン時）はモックデータで表示
  useEffect(() => { loadProjects(null); }, [loadProjects]);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      // ユーザー情報を取得
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const info = await res.json();
      setUserInfo(info);
      await loadProjects(token);
    },
    onError: (err) => setError(`Googleログインに失敗しました: ${err.error ?? '不明なエラー'}`),
  });

  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setUserInfo(null);
    loadProjects(null);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-logo">⚡ AZ</span>
        <span className="app-title">副資材発注リスト管理ツール</span>
        <span className="app-corp">アズマ電気工事部</span>
        <div className="header-spacer" />
        {accessToken ? (
          <div className="auth-info">
            <span className="header-user">{userInfo?.name ?? 'ログイン中'}</span>
            <button className="btn-logout" onClick={logout}>ログアウト</button>
          </div>
        ) : (
          <button className="btn-google-login" onClick={() => login()}>
            Googleでログイン
          </button>
        )}
      </header>

      {error && (
        <div className="error-banner">⚠ {error}</div>
      )}

      <main className="app-main">
        {loading ? (
          <div className="loading">読み込み中…</div>
        ) : selected ? (
          <ProjectDetail
            project={selected}
            role={role}
            onBack={() => setSelected(null)}
            onScan={() => alert('納品書取込（未実装）')}
          />
        ) : (
          <ProjectList
            projects={projects}
            onSelect={setSelected}
          />
        )}
      </main>
    </div>
  );
}
