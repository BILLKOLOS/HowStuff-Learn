import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@context': path.resolve(__dirname, './src/context'),
        '@store': path.resolve(__dirname, './src/store'),
        '@types': path.resolve(__dirname, './src/types'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@config': path.resolve(__dirname, './src/config')
      }
    },
    define: {
      __DEV__: mode === 'development',
    },
    server: {
      port: 3000,
    },
    build: {
      sourcemap: true,
    },
  };
})
