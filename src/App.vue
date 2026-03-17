<script setup>
// vue3 中this不能直接使用
// 1.获取路由对象 router useRouter
//   const router = useRouter()
// 2.获取路由参数 route
//   const route = useRoute()

import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores' //因为合并了模块，所以直接引入即可

const router = useRouter() // 获取路由对象
const route = useRoute() // 获取路由参数

const goList = () => {
  // this.$router.push('/list')不能在setup中使用
  console.log(router, route)
  router.push('/list')
}

const userStore = useUserStore()
</script>

<template>
  <div>
    <hr />
    <router-view></router-view>
    <hr />
    <hr />
    <hr />
    我是app
    <el-button @click="$router.push('/home')">跳首页</el-button>
    <el-button @click="goList">跳列表页</el-button>

    <p>当前token: {{ userStore.token }}</p>
    <el-button @click="userStore.setToken('123456')">登录</el-button>
    <el-button @click="userStore.removeToken">退出</el-button>
  </div>
</template>

<style scoped></style>
