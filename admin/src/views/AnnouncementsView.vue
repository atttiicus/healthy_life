<template>
  <el-card>
    <div class="toolbar">
      <el-button type="success" @click="openCreate">
        <el-icon><Plus /></el-icon>&nbsp;新增公告
      </el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe style="margin-top: 16px">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="tagConfig[row.tag as 'NEW'|'FIX'|'INFO']?.type">
            {{ row.tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">
            {{ row.is_active ? '已发布' : '已下线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="175">
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确认删除该公告？" @confirm="handleDelete(row.id)">
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
    />
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑公告' : '新增公告'"
    width="600px"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="70px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入公告标题" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="类型" prop="tag">
            <el-select v-model="form.tag" style="width: 100%">
              <el-option label="NEW（新功能）" value="NEW" />
              <el-option label="FIX（修复）" value="FIX" />
              <el-option label="INFO（通知）" value="INFO" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者">
            <el-input v-model="form.author" placeholder="管理员" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否发布">
        <el-switch v-model="form.is_active" active-text="发布" inactive-text="下线" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="请输入公告内容"
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
import { getAnnouncementList, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../api'
import type { Announcement } from '../types'

const loading = ref(false)
const submitting = ref(false)
const list = ref<Announcement[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  tag: 'NEW',
  author: '管理员',
  is_active: true,
  content: '',
})

const rules: FormRules = {
  title:   [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const tagConfig = {
  NEW:  { type: 'success' as const },
  FIX:  { type: 'warning' as const },
  INFO: { type: 'primary' as const },
}

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getAnnouncementList({ page: page.value, limit: pageSize.value })) as {
      list: Announcement[]
      total: number
    }
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  isEdit.value = false
  editId.value = null
  Object.assign(form, { title: '', tag: 'NEW', author: '管理员', is_active: true, content: '' })
  dialogVisible.value = true
}

const openEdit = (row: Announcement) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    tag: row.tag,
    author: row.author,
    is_active: row.is_active,
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
        await updateAnnouncement(editId.value, { ...form })
        ElMessage.success('更新成功')
      } else {
        await createAnnouncement({ ...form })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = async (id: number) => {
  await deleteAnnouncement(id)
  ElMessage.success('删除成功')
  loadData()
}

const formatDate = (date: string) => (date ? date.slice(0, 19).replace('T', ' ') : '-')

onMounted(loadData)
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
