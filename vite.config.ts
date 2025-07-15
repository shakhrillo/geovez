import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@esri/calcite-components', '@esri/calcite-components-react', 'scrollparent'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 8081,
    host: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost.crt")),
    }
  },
})
