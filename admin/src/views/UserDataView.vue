<template>
  <div>
    <el-page-header style="margin-bottom: 16px" @back="router.push('/users')">
      <template #content>
        <span>用户 UID {{ uid }} · 健康数据</span>
      </template>
    </el-page-header>

    <el-card>
      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column label="日期" width="120">
          <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
        </el-table-column>
        <el-table-column prop="weight" label="体重(kg)" width="100" />
        <el-table-column prop="calorie" label="卡路里(kcal)" width="120" />
        <el-table-column prop="stepNum" label="步数" width="100" />
        <el-table-column prop="exerciseTime" label="运动(min)" width="100" />
        <el-table-column prop="sleepTime" label="睡眠时长" width="100" />
        <el-table-column prop="foods" label="饮食记录" min-width="200" show-overflow-tooltip />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserHealthData } from '../api'
import type { DayData } from '../types'
import { formatDate } from '../utils/format'

const route  = useRoute()
const router = useRouter()

const uid = Number(route.params.uid)
if (isNaN(uid)) router.push('/users')

const loading  = ref(false)
const list     = ref<DayData[]>([])
const total    = ref(0)
const page     = ref(1)
const pageSize = ref(20)

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getUserHealthData(uid, {
      page: page.value,
      limit: pageSize.value,
    })) as { list: DayData[]; total: number }
    list.value  = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}


onMounted(loadData)
</script>
