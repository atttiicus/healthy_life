<template>
  <el-card>
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索标题或作者"
        clearable
        style="width: 260px"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="openCreate">
        <el-icon><Plus /></el-icon>&nbsp;新增文章
      </el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe style="margin-top: 16px">
      <el-table-column prop="aid" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column label="类型" width="85">
        <template #default="{ row }">
          <el-tag :type="typeConfig[row.type as 0 | 1 | 2]?.tagType">
            {{ typeConfig[row.type as 0 | 1 | 2]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="175">
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确认删除该文章？" @confirm="handleDelete(row.aid)">
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      style="margin-top: 16px; display: flex; justify-content: flex-end"
      @current-change="loadData"
      @size-change="loadData"
    />
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑文章' : '新增文章'"
    width="680px"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="70px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="作者名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" style="width: 100%">
              <el-option label="原创" :value="0" />
              <el-option label="转载" :value="1" />
              <el-option label="未知" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="封面" prop="image">
        <el-input v-model="form.image" placeholder="图片文件名，如 1.jpg" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="8"
          placeholder="请输入文章内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getArticleList, createArticle, updateArticle, deleteArticle } from '../api'
import type { Article } from '../types'
import { formatDatetime as formatDate } from '../utils/format'

const loading = ref(false)
const submitting = ref(false)
const list = ref<Article[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  author: '佚名',
  type: 0,
  image: '1.jpg',
  content: '',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const typeConfig = {
  0: { label: '原创', tagType: '' as const },
  1: { label: '转载', tagType: 'success' as const },
  2: { label: '未知', tagType: 'info' as const },
}

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getArticleList({
      page: page.value,
      limit: pageSize.value,
      keyword: keyword.value || undefined,
    })) as { list: Article[]; total: number }
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  loadData()
}

const openCreate = () => {
  isEdit.value = false
  editId.value = null
  Object.assign(form, { title: '', author: '佚名', type: 0, image: '1.jpg', content: '' })
  dialogVisible.value = true
}

const openEdit = (row: Article) => {
  isEdit.value = true
  editId.value = row.aid
  Object.assign(form, {
    title: row.title,
    author: row.author,
    type: row.type,
    image: row.image,
    content: row.content,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (isEdit.value && editId.value) {
        await updateArticle(editId.value, { ...form })
        ElMessage.success('更新成功')
      } else {
        await createArticle({ ...form })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = async (aid: number) => {
  await deleteArticle(aid)
  ElMessage.success('删除成功')
  loadData()
}


onMounted(loadData)
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
