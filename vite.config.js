import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api': {
        // target: 'http://192.168.0.102:9018/',
        target: 'https://ai.credit.jxjaxzf.gov.cn/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/chat-api': {
        target: 'http://192.168.0.102:8080/',
        //target: 'http://223.82.206.98:82/chat-api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/chat-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './src'),
      components: resolve(__dirname, './src/components'),
      styles: resolve(__dirname, './src/styles'),
      utils: resolve(__dirname, './src/utils'),
    },
  },
  plugins: [vue()],
  build: {
    // 生产环境移除console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      format: {
        comments: false,
      },
    },
    // 禁用source map
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 混淆文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
