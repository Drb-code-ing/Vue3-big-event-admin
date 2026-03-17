import { createApp } from 'vue'
import pinia from '@/stores/index.js' // 引入pinia

import App from './App.vue'
import router from './router'
import '@/assets/main.scss'

const app = createApp(App)

app.use(pinia) // 开启pinia持久化
app.use(router)

app.mount('#app')
