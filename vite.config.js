import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_PATH を設定すると GitHub Pages など
// サブパスデプロイに対応できる（例: /azuma-sub-materials-tool/）
// Vercel・Firebase は '/' のままでよい
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  plugins: [react()],
  base,
})
