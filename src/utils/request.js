import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // 基础URL，超时时间
  baseURL,
  timeout: 5000
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 处理成功响应
    if (response.data.code === 0) {
      return response
    }
    // 处理失败响应, 弹出错误信息
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  function (err) {
    // 对响应错误做点什么
    // 错误401情况：1.权限不足  2. token过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 错误默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
