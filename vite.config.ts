import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// Identificador de cada build: el front lo compara con /version.json para avisar
// "hay una nueva versión" cuando se publica sin que el usuario recargue.
const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || String(Date.now())

function versionFile(): Plugin {
  return {
    name: 'kova-version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: APP_VERSION, builtAt: new Date().toISOString() }),
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), versionFile()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  server: {
    port: 5173,
    // Hosts desde los que se sirve el dev server a través de túneles (cloudflared).
    allowedHosts: ['.bakano.ec', '.trycloudflare.com'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Solo tokens, funciones y mixins: este archivo se antepone a CADA bloque
        // <style lang="scss">, así que nada que emita CSS puede vivir ahí.
        // El reset y las custom properties están en global.scss, que se importa
        // una sola vez desde main.ts.
        additionalData: `@use "@/styles/index.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
  },
})
