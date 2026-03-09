import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 改成相對路徑，讓它能在任何子層資料夾執行
  plugins: [react()],
})