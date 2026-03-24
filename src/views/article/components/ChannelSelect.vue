<script setup>
import { artGetChannelService } from '@/api/article.js'
import { onMounted, ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelService()
  console.log(res)
  channelList.value = res.data.data
}
onMounted(() => {
  getChannelList()
})
</script>

<template>
  <el-select
    :style="{ width: width || '240px' }"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <!-- label: 展示给用户看的, value: 提交给后台的,与modelValue保持一致的会被选中显示 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
