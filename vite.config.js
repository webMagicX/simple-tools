import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({ vueTsc: true }),
    vueSetupExtend(), // name 取名；<script setup name="componentName">
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: './dist/dist',
    lib: {
      entry: path.resolve(__dirname, './src/utils'),
      name: 'simple-tools',
      fileName: 'index'
    }
  }
})
