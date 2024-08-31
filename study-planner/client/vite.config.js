import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    https: {
      key: './https-ssl/studyplanner-privateKey.key',
      cert: './https-ssl/studyplanner.crt',
    }
  },
  plugins: [react()],
})
