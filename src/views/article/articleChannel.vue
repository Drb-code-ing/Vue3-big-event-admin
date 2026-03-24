<script setup>
import { ref, onMounted } from 'vue'
import { artGetChannelService, artDeleteChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  loading.value = false
}

onMounted(() => {
  getChannelList()
})

const onEditChannel = (row, index) => {
  console.log(row, index)
  dialog.value.open(row)
}
const onDeleteChannel = async (row, index) => {
  console.log(row, index)
  await ElMessageBox.confirm('你确认要删除该分类吗?', '温馨提示:', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList() // 刷新数据
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList() // 刷新数据
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 主体部分 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <!-- prop 是要显示的字段，其中内容从channelList的每一项中获取 -->
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row 就是channelList的每一项， $index 就是当前项的下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 如果没有数据，就显示暂无数据提示 -->
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>

    <!-- 弹层组件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>

<style scoped></style>
