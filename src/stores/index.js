import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 合并模块
// import { useUserStore } from './modules/user'
// export { useUserStore }
export * from './modules/user' // 相当于导出user模块的所有内容
