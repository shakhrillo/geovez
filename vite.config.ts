import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    port: 3000,
    host: true,
    https: {},
  },
})
