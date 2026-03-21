<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'

const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是1-10个非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15个字母、数字',
      trigger: 'blur'
    }
  ]
}

// 提交表单
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate() // 校验表单, validate 方法返回一个 Promise, 成功返回 true, 失败返回 false
  const isEdit = formModel.value.id
  if (isEdit) {
    // 编辑操作
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加操作
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false // 关闭弹层
  emit('success') // 刷新父组件数据
}
// 组件暴露一个方法 open, 基于open传来的参数区分是添加还是编辑
// open({}) => 表单无需渲染
// open({id, cate_name, cate_alias, ...}) => 表单需要渲染，说明是编辑
// open调用后可以打开弹层

const open = (row) => {
  console.log(row)
  formModel.value = { ...row } // 添加 -> 重置了表单内容, 编辑 -> 回显了表单数据
  dialogVisible.value = true
}
// 向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="500"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
