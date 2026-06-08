<template>
  <el-card>
    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索账号或用户名"
        clearable
        style="width: 260px"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe style="margin-top: 16px">
      <el-table-column prop="uid" label="UID" width="80" />
      <el-table-column prop="account" label="账号" min-width="130" />
      <el-table-column prop="user_name" label="用户名" min-width="120" />
      <el-table-column prop="sex" label="性别" width="70" />
      <el-table-column prop="age" label="年龄" width="70" />
      <el-table-column prop="email" label="邮箱" min-width="160" show-overflow-tooltip />
      <el-table-column label="注册时间" width="175">
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="viewHealthData(row.uid)">
            健康数据
          </el-button>
          <el-popconfirm
            title="确认删除该用户？此操作不可恢复。"
            @confirm="handleDelete(row.uid)"
          >
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserList, deleteUser } from '../api'
import type { User } from '../types'

const router = useRouter()

const loading = ref(false)
const list = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getUserList({
      page: page.value,
      limit: pageSize.value,
      keyword: keyword.value || undefined,
    })) as { list: User[]; total: number }
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

const handleDelete = async (uid: number) => {
  await deleteUser(uid)
  ElMessage.success('删除成功')
  loadData()
}

const viewHealthData = (uid: number) => router.push(`/users/${uid}/data`)

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
