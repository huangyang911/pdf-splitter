import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pdf-splitter/',   // ← 必須與你的 repo 名稱完全一致
  plugins: [react()],
})