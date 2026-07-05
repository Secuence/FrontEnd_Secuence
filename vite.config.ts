import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// Multi-page: el sitio real es el export de Claude Design (index.html +
// auth-flow.html), no una SPA de React. Vite solo aporta dev server,
// variables de entorno (.env) y bundling para el build de producción.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // El backend real (Railway) todavía no tiene CORS habilitado para
      // llamadas desde el navegador (confirmado: OPTIONS devuelve 405 sin
      // cabeceras Access-Control-*). Mientras el equipo de backend lo
      // arregla, este proxy reenvía /api/* desde el propio dev server
      // (sin pasar por el navegador), así que no lo bloquea CORS. Ver
      // src/services/apiClient.ts. Esto SOLO aplica a `npm run dev`; en
      // producción (`vite build`) el navegador sí llama directo a
      // VITE_API_BASE_URL y necesita que el backend permita ese origen.
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: true,
        },
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
  }
})
