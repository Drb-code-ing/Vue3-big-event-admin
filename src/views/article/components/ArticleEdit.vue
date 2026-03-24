<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.snow.css'
import {
  artpublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 表单数据
const formModel = ref({
  title: '', // 文章标题
  cate_id: '', // 文章分类id
  cover_img: '', // 文章封面图片(file对象)
  content: '', // 文章内容
  state: '' // 发布状态
})

// 图片上传相关
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 本地预览图片
  formModel.value.cover_img = uploadFile.raw // 提交给后台的图片对象
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布或草稿状态赋值给state
  formModel.value.state = state
  // 注意：当前接口需要formData对象
  // 将普通对象转换为formData对象
  const formData = new FormData()
  for (let key in formModel.value) {
    formData.append(key, formModel.value[key]) // 遍历formModel.value对象，将每个属性添加到formData对象中
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await artEditService(formData)
    ElMessage.success('修改成功')
    visibleDrawer.value = false // 关闭抽屉
    // 通知父组件,编辑成功
    emit('success', 'edit')
  } else {
    // 添加操作
    await artpublishService(formData)
    ElMessage.success('添加成功')
    visibleDrawer.value = false // 关闭抽屉
    // 通知父组件,添加成功
    emit('success', 'add')
  }
}

// 组件暴露一个方法 open, 基于open传来的参数区分是添加还是编辑
// open({}) => 表单无需渲染
// open({id, cate_name, cate_alias, ...}) => 表单需要渲染，说明是编辑
// open调用后可以打开弹层
const editorRef = ref() // 富文本编辑器实例
const open = async (row) => {
  visibleDrawer.value = true // 打开抽屉
  if (row.id) {
    // 存在，需要基于row.id发布请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 处理图片路径，将图片路径添加到baseURL
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交后台需要数据格式是file对象，需要将图片对象转换为file对象,便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 不存在，说明是添加文章，重置表单数据
    formModel.value = {
      title: '',
      cate_id: '',
      cover_img: '',
      content: '',
      state: ''
    }
    // 重置图片预览地址和富文本编辑器内容
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图标
             语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
