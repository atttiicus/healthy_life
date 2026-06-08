<template>
  <view class="min-h-screen bg-[#f5f7fa] pb-8">

    <!-- 渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">心情日记</text>
      <text class="text-sm block mt-1" style="color:rgba(255,255,255,.7)">
        记录每天的心情，关注内心世界
      </text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- 今日记录卡 -->
      <view class="card p-5">
        <text class="text-sm font-semibold text-[#1f2937] block mb-4">
          今天心情如何？
        </text>

        <!-- 5 档心情选择 -->
        <view class="flex gap-2 mb-4">
          <view
            v-for="opt in moodOptions" :key="opt.value"
            class="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl"
            :style="getMoodBtnStyle(opt.value)"
            @tap="selectedMood = opt.value"
          >
            <van-icon :name="opt.icon" size="24" :color="getMoodColor(opt.value)" />
            <text class="text-xs font-medium" :style="{ color: getMoodColor(opt.value) }">
              {{ opt.label }}
            </text>
          </view>
        </view>

        <!-- 备注输入 -->
        <view v-if="selectedMood" class="input-wrap mb-4">
          <input
            class="flex-1 text-sm text-[#1f2937] bg-transparent"
            v-model="note"
            placeholder="写下此刻的感受（选填）"
            placeholder-style="color:#9ca3af"
            :maxlength="100"
          />
        </view>

        <!-- 提交按钮 -->
        <view
          class="h-11 rounded-xl flex items-center justify-center"
          :style="{ background: selectedMood ? 'linear-gradient(135deg,#10b981,#059669)' : '#f3f4f6' }"
          @tap="submitMood"
        >
          <text class="text-sm font-semibold"
                :style="{ color: selectedMood ? '#fff' : '#9ca3af' }">
            {{ todayRecord ? '更新今日心情' : '记录今日心情' }}
          </text>
        </view>

        <!-- 今日已记录提示 -->
        <view v-if="todayRecord" class="flex items-center gap-2 mt-3 pt-3"
              style="border-top:1px solid #f3f4f6">
          <view class="w-2 h-2 rounded-full" :style="{ background: getMoodColor(todayRecord.mood) }"></view>
          <text class="text-xs text-[#6b7280]">
            今日已记录：{{ getMoodLabel(todayRecord.mood) }}
            <text v-if="todayRecord.note">· {{ todayRecord.note }}</text>
          </text>
        </view>
      </view>

      <!-- 历史记录 -->
      <view class="card p-4">
        <text class="sec-title block mb-3">近期心情</text>

        <view v-if="!history.length" class="py-4">
          <van-empty description="暂无心情记录" image-size="80" />
        </view>

        <view v-else class="flex flex-col gap-0">
          <view
            v-for="(item, idx) in history" :key="item.id"
            class="flex items-center gap-3 py-3"
            :style="idx < history.length - 1 ? 'border-bottom:1px solid #f3f4f6' : ''"
          >
            <!-- 心情色块 -->
            <view class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  :style="{ background: getMoodBg(item.mood) }">
              <van-icon :name="getMoodIcon(item.mood)" size="22" :color="getMoodColor(item.mood)" />
            </view>

            <!-- 内容 -->
            <view class="flex-1 min-w-0">
              <view class="flex items-center justify-between">
                <text class="text-sm font-medium"
                      :style="{ color: getMoodColor(item.mood) }">
                  {{ getMoodLabel(item.mood) }}
                </text>
                <text class="text-xs text-[#9ca3af]">{{ item.log_date }}</text>
              </view>
              <text v-if="item.note"
                    class="text-xs text-[#6b7280] block mt-0.5"
                    style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">
                {{ item.note }}
              </text>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

const MOOD_CONFIG = {
  1: { label: '很差', icon: 'close',      color: '#ef4444', bg: '#fef2f2' },
  2: { label: '较差', icon: 'warning-o',  color: '#f97316', bg: '#fff7ed' },
  3: { label: '一般', icon: 'info-o',     color: '#eab308', bg: '#fefce8' },
  4: { label: '较好', icon: 'smile-o',    color: '#22c55e', bg: '#f0fdf4' },
  5: { label: '很好', icon: 'like-o',     color: '#10b981', bg: '#ecfdf5' },
}

export default {
  data() {
    return {
      selectedMood: 0,
      note:         '',
      todayRecord:  null,
      history:      [],
      moodOptions:  [1, 2, 3, 4, 5].map(v => ({ value: v, ...MOOD_CONFIG[v] })),
    }
  },
  computed: {
    ...mapState(['user']),
  },
  onShow() {
    this.loadTodayMood()
    this.loadHistory()
  },
  methods: {
    getMoodLabel(mood) { return (MOOD_CONFIG[mood] || {}).label || '' },
    getMoodIcon(mood)  { return (MOOD_CONFIG[mood] || {}).icon  || 'info-o'  },
    getMoodColor(mood) { return (MOOD_CONFIG[mood] || {}).color || '#9ca3af' },
    getMoodBg(mood)    { return (MOOD_CONFIG[mood] || {}).bg    || '#f3f4f6' },
    getMoodBtnStyle(value) {
      const isSelected = this.selectedMood === value
      const cfg = MOOD_CONFIG[value] || {}
      return {
        background:  isSelected ? cfg.bg    : '#f9fafb',
        border:      isSelected ? ('2px solid ' + cfg.color) : '2px solid transparent',
        cursor:      'pointer',
      }
    },

    loadTodayMood() {
      const token = this.user.token
      if (!token) return
      uni.request({
        url: '/api/mood/today',
        method: 'GET',
        header: { token },
        success: res => {
          const data = res.data && res.data.data ? res.data.data : null
          this.todayRecord  = data
          this.selectedMood = data ? data.mood : 0
          this.note         = data ? (data.note || '') : ''
        },
      })
    },

    loadHistory() {
      const token = this.user.token
      if (!token) return
      uni.request({
        url: '/api/mood/history?days=30',
        method: 'GET',
        header: { token },
        success: res => {
          this.history = res.data && res.data.data ? res.data.data : []
        },
      })
    },

    submitMood() {
      if (!this.selectedMood) {
        uni.showToast({ title: '请先选择心情', icon: 'none' })
        return
      }
      uni.request({
        url: '/api/mood/log',
        method: 'POST',
        header: { token: this.user.token, 'content-type': 'application/json' },
        data: { mood: this.selectedMood, note: this.note },
        success: res => {
          if (res.data && res.data.code === 20000) {
            uni.showToast({ title: '记录成功', icon: 'none', duration: 1200 })
            this.loadTodayMood()
            this.loadHistory()
          } else {
            const msg = res.data && res.data.message ? res.data.message : '记录失败'
            uni.showToast({ title: msg, icon: 'none' })
          }
        },
        fail: () => uni.showToast({ title: '网络错误', icon: 'none' }),
      })
    },
  },
}
</script>

<style scoped></style>
