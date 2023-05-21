import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import utools from 'vite-plugin-utools'
import path from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist/'
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
      buildUpx: {
        pluginPath: './plugin.json',
        outDir: 'dist-upx',
        outName: '[pluginName]_[version].upx'
      }
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
