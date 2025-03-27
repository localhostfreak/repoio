import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
    'global': {},
    'process.version': '"v16.0.0"',
    '__dirname': '"/"',
  },
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Specify port
    watch: {
      usePolling: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
