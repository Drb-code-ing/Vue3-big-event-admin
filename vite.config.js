import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: '/drb/', // 路由基础路径
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
