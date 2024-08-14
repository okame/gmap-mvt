import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const server = mode === 'development' ? {
    host: true,
    proxy: {
      '^/api': {
        changeOrigin: true,
        target: process.env.VITE_BASE_URL
      },
    }
  } : undefined

  return defineConfig({
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/lib/MvtMapType.ts'),
        name: 'MvtMapType',
        fileName: 'mvt-map-type'
      }
    }
  })
}
