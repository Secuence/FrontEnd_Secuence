import { defineConfig } from 'vite'
import path from 'path'

// Multi-page: el sitio real es el export de Claude Design (index.html +
// auth-flow.html), no una SPA de React. Vite solo aporta dev server,
// variables de entorno (.env) y bundling para el build de producción.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        authFlow: path.resolve(__dirname, 'auth-flow.html'),
      },
    },
  },
})
