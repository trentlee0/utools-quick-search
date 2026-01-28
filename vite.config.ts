import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import utools from 'vite-plugin-utools'
import path from 'path'

export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  base: './',
  build: {
    outDir: 'dist/'
  },
  css: {
    preprocessorOptions: {
      sass: {}
    }
  },
  plugins: [
    vue(),
    utools({
      external: 'utools-api',
      preload: {
        path: './src/preload.ts',
        watch: true,
        name: 'window.preload'
      },
      buildUpx: false
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  }
})
