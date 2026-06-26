import { useState, useEffect, useCallback } from 'react';
import { googleLogout } from '@react-oauth/google';
import { INITIAL_PROJECTS } from './data/sampleData';
import Sidebar from './components/Sidebar';
import KpiCards from './components/KpiCards';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import InvoiceUpload from './components/InvoiceUpload';
import GoogleLoginButton from './components/GoogleLoginButton';
import { fetchProjectsFromSheet } from './utils/helpers';

export default function App({ oauthEnabled = false }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo]       = useState(null);
  const [projects, setProjects]       = useState(INITIAL_PROJECTS);
  const [selected, setSelected]       = useState(null);
  const [scanning, setScanning]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [activeNav, setActiveNav]     = useState('projects');

  const role = { canScan: !!accessToken };

  const loadProjects = useCallback(async (token) => {
    if (!token) return;
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

  const handleLoginSuccess = useCallback(async (tokenResponse) => {
    const token = tokenResponse.access_token;
    setAccessToken(token);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(await res.json());
    } catch { /* ignore */ }
    await loadProjects(token);
  }, [loadProjects]);

  const handleLoginError = useCallback((err) => {
    setError(`Googleログインに失敗しました: ${err.error ?? '不明なエラー'}`);
  }, []);

  const logout = useCallback(() => {
    googleLogout();
    setAccessToken(null);
    setUserInfo(null);
    setProjects(INITIAL_PROJECTS);
  }, []);

  const handleImport = useCallback((newItems) => {
    const stamp = () => newItems.map((item, i) => ({ ...item, id: `ocr-${Date.now()}-${i}` }));
    setProjects(prev => prev.map(p =>
      p.id === selected.id ? { ...p, items: [...p.items, ...stamp()] } : p
    ));
    setSelected(prev => ({ ...prev, items: [...prev.items, ...stamp()] }));
    setScanning(false);
  }, [selected]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-800">電気工事部 発注リスト管理ツール</h1>
            <span className="text-xs text-slate-400">| (株)アズマ 電気工事部</span>
          </div>

          <div className="flex items-center gap-3">
            {oauthEnabled ? (
              accessToken ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{userInfo?.name ?? 'ログイン中'}</span>
                  <button
                    onClick={logout}
                    className="text-xs text-slate-500 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <GoogleLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
              )
            ) : (
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">デモモード</span>
            )}

            <select className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 outline-none">
              <option>電気工事部 部長</option>
              <option>現場担当者</option>
              <option>経理担当者</option>
            </select>

            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[20px] text-slate-500">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex items-center gap-2 px-6 py-2.5 bg-teal-50 border-b border-teal-100">
          <span className="material-symbols-outlined text-[16px] text-teal-600">info</span>
          <span className="text-xs text-teal-700">
            サポートモード: 現在のデータはサンプルです。Google Sheetsと連携すると実データが表示されます。
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-red-50 border-b border-red-100">
            <span className="material-symbols-outlined text-[16px] text-red-500">error</span>
            <span className="text-xs text-red-700">{error}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">読み込み中...</div>
          ) : selected ? (
            <ProjectDetail
              project={selected}
              role={role}
              onBack={() => setSelected(null)}
              onScan={() => setScanning(true)}
            />
          ) : (
            <>
              <KpiCards projects={projects} />
              <ProjectList projects={projects} onSelect={setSelected} />
            </>
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
    </div>
  );
}
