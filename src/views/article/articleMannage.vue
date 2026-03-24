<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

const total = ref(0) // 文章总数
const articleList = ref([]) // 文章列表
const loading = ref(false) // 加载状态

// 定义请求参数对象
const params = ref({
  pagenum: 1, // 页码
  pagesize: 5, // 每页数量
  cate_id: '', // 文章分类id
  state: '' // 发布状态
})
// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
onMounted(() => {
  getArticleList()
})
// 分页相关(使用element-plus的分页组件el-pagination)
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
// 搜索文章 => 按最新的添加重新检索 -> 重置分页
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

// 重置文章
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 添加文章
const articleEditRef = ref()
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 删除文章
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认要删除该文章吗?', '温馨提示:', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

// 添加或编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  }
  // 如果是编辑，直接渲染当前页
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <!-- inline: 表内布局, 表单元素会水平排列 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- vue2: v-model= :value + @input -->
        <!-- vue3: v-model= :modelValue + @update:modelValue -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里后台标记发布状态我们直接通过中文 -->
        <el-select style="width: 240px" v-model="params.state">
          <!-- 这里v-model会选择选中的option的value值 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 通过el-link组件实现点击跳转功能 -->
        <!-- row: 表格当前行数据对象, 可以通过row.Id获取到当前行的Id -->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <!-- 格式化发布时间时间(prop会被template覆盖，不用删除) -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 文章编辑抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>

<style scoped></style>
