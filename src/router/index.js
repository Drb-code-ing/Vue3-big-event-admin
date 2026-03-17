import { createRouter, createWebHistory } from 'vue-router'

// createRouter 创建路由实例
// 1.createWebHistory 路由模式：history 模式 地址栏没有#号
// 2.createWebHashHistory 路由模式：hash 模式 地址栏有#号

// vite 中的环境变量 import.meta.env.BASE_URL 可以在vite.config.js中配置base选项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 路由模式
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/article/mannage',
      children: [
        {
          path: '/article/mannage',
          component: () => import('@/views/article/articleMannage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/articleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/userProfile.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/userPassword.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/userAvatar.vue')
        }
      ]
    }
  ]
})

export default router
