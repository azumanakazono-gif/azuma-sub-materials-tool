import { useState } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import { sampleProjects } from './data/sampleData';

export default function App() {
  const [selected, setSelected] = useState(null);
  const role = { canScan: true };

  return (
    <div className="app-root">
      <header className="app-header">
        <span className="app-logo">⚡ AZ</span>
        <span className="app-title">副資材発注リスト管理ツール</span>
        <span className="app-corp">アズマ電気工事部</span>
        <div className="header-spacer" />
        <span className="header-user">田中 一郎</span>
      </header>
      <main className="app-main">
        {selected
          ? <ProjectDetail
              project={selected}
              role={role}
              onBack={() => setSelected(null)}
              onScan={() => alert('納品書取込（未実装）')}
            />
          : <ProjectList
              projects={sampleProjects}
              onSelect={setSelected}
            />
        }
      </main>
    </div>
  );
}
