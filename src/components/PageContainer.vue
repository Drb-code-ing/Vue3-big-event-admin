<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 额外操作按钮，具名插槽 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 内容部分,默认插槽 -->
    <slot></slot>
  </el-card>
</template>

<style scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
