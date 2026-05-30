import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

const content = clientId ? (
  // clientId が設定されている場合のみ GoogleOAuthProvider でラップする
  // 空文字のまま渡すとランタイムクラッシュするため条件分岐する
  <GoogleOAuthProvider clientId={clientId}>
    <App oauthEnabled />
  </GoogleOAuthProvider>
) : (
  <App oauthEnabled={false} />
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {content}
    </ErrorBoundary>
  </StrictMode>,
)
