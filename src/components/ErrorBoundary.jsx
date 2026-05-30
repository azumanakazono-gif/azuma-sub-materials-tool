import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            副資材発注リスト管理ツール
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
            {this.state.error.message}
          </div>
          <button
            style={{
              background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: 7, padding: '8px 20px', cursor: 'pointer', fontSize: 13,
            }}
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
