<template>
  <el-row :gutter="20">
    <el-col :span="8" v-for="card in statCards" :key="card.label">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-inner">
          <div class="stat-icon" :style="{ background: card.color }">
            <el-icon :size="28"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">
              <span v-if="loaded">{{ stats[card.key] }}</span>
              <el-skeleton-item v-else variant="text" style="width: 60px; height: 36px" />
            </div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getStats } from '../api'
import type { Stats } from '../types'

const stats = ref<Stats>({ userCount: 0, articleCount: 0, dataCount: 0 })
const loaded = ref(false)

const statCards: { key: keyof Stats; label: string; icon: string; color: string }[] = [
  { key: 'userCount', label: '注册用户', icon: 'User', color: '#409eff' },
  { key: 'articleCount', label: '健康文章', icon: 'Document', color: '#67c23a' },
  { key: 'dataCount', label: '健康记录', icon: 'DataLine', color: '#e6a23c' },
]

onMounted(async () => {
  stats.value = (await getStats()) as Stats
  loaded.value = true
})
</script>

<style scoped>
.stat-card {
  margin-bottom: 20px;
}
.stat-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-number {
  font-size: 34px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}
</style>
