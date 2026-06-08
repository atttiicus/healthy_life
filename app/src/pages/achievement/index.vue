<template>
  <view class="min-h-screen bg-[#f5f7fa] pb-8">

    <!-- 渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">我的成就</text>
      <view class="flex items-baseline gap-1 mt-3">
        <text class="text-white font-bold" style="font-size:32px">{{ unlockedCount }}</text>
        <text class="text-sm" style="color:rgba(255,255,255,.7)">/ {{ achievements.length }} 已解锁</text>
      </view>
      <!-- 总进度条 -->
      <view class="mt-3 h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,.2)">
        <view class="h-2 rounded-full bg-white"
              :style="{ width: totalProgressPct }"></view>
      </view>
    </view>

    <view class="px-4 -mt-8">

      <!-- 加载骨架 -->
      <view v-if="loading" class="grid grid-cols-2 gap-3">
        <view v-for="i in 6" :key="i" class="card p-4">
          <view class="w-12 h-12 rounded-2xl bg-[#f3f4f6] mb-3"></view>
          <view class="bg-[#f3f4f6] rounded-full mb-2" style="height:14px;width:60%"></view>
          <view class="bg-[#f3f4f6] rounded-full" style="height:12px;width:80%"></view>
        </view>
      </view>

      <!-- 成就网格 -->
      <view v-else class="grid grid-cols-2 gap-3">
        <view
          v-for="item in achievements" :key="item.id"
          class="card p-4"
          :style="getCardStyle(item.unlocked)"
        >
          <!-- 图标区 -->
          <view class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                :style="getIconBgStyle(item.unlocked)">
            <van-icon
              :name="item.icon || 'star-o'"
              size="26"
              :color="item.unlocked ? 'var(--icon-primary)' : '#d1d5db'"
            />
          </view>

          <!-- 标题 + 描述 -->
          <text class="text-sm font-semibold block mb-1"
                :style="{ color: item.unlocked ? '#1f2937' : '#9ca3af' }">
            {{ item.title }}
          </text>
          <text class="text-xs leading-relaxed block"
                :style="{ color: item.unlocked ? '#6b7280' : '#d1d5db' }">
            {{ item.description }}
          </text>

          <!-- 解锁时间 / 未解锁提示 -->
          <view class="mt-2 pt-2" style="border-top:1px solid #f3f4f6">
            <text v-if="item.unlocked" class="text-xs" style="color:var(--icon-primary)">
              {{ formatDate(item.unlocked_at) }} 解锁
            </text>
            <text v-else class="text-xs text-[#d1d5db]">{{ item.condition_desc }}</text>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      achievements: [],
    }
  },
  computed: {
    ...mapState(['user']),
    unlockedCount() {
      return this.achievements.filter(item => item.unlocked).length
    },
    totalProgressPct() {
      if (!this.achievements.length) return '0%'
      return Math.round(this.unlockedCount / this.achievements.length * 100) + '%'
    },
  },
  onShow() {
    this.loadData()
  },
  methods: {
    loadData() {
      const token = this.user.token
      if (!token) return
      this.loading = true
      uni.request({
        url: '/api/achievement/list',
        method: 'GET',
        header: { token },
        success: res => {
          const list = res.data && res.data.data ? res.data.data : []
          this.achievements = list.map(item => ({
            ...item,
            condition_desc: this.buildConditionDesc(item.condition_type, item.condition_value),
          }))
        },
        fail: () => uni.showToast({ title: '加载失败', icon: 'none' }),
        complete: () => { this.loading = false },
      })
    },
    buildConditionDesc(conditionType, conditionValue) {
      const descMap = {
        checkin_count:  '打卡 ' + conditionValue + ' 次',
        checkin_streak: '连续打卡 ' + conditionValue + ' 天',
        workout_count:  '完成 ' + conditionValue + ' 次运动',
        habit_count:    '创建 ' + conditionValue + ' 个习惯',
        habit_max_days: '习惯坚持 ' + conditionValue + ' 天',
      }
      return descMap[conditionType] || '完成条件'
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return String(dateStr).slice(0, 10)
    },
    getCardStyle(unlocked) {
      return unlocked
        ? 'border: 1.5px solid #d1fae5; box-shadow: 0 2px 8px rgba(16,185,129,.08)'
        : 'opacity: 0.7'
    },
    getIconBgStyle(unlocked) {
      return { background: unlocked ? '#ecfdf5' : '#f3f4f6' }
    },
  },
}
</script>

<style scoped></style>
