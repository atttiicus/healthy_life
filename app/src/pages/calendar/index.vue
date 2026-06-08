<template>
  <view class="min-h-screen bg-[#f5f7fa] pb-8">

    <!-- 渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">
        {{ currentYear }}年{{ currentMonth }}月
      </text>
      <view class="flex gap-6 mt-3">
        <view class="text-center">
          <text class="text-white font-bold block" style="font-size:24px">{{ monthRecordCount }}</text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">本月记录天数</text>
        </view>
        <view class="text-center">
          <text class="text-white font-bold block" style="font-size:24px">{{ daysInMonth }}</text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">当月总天数</text>
        </view>
      </view>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- 月历卡片 -->
      <view class="card p-4">

        <!-- 月份切换 -->
        <view class="flex items-center justify-between mb-4">
          <view class="w-8 h-8 rounded-xl bg-[#f3f4f6] flex items-center justify-center"
                @tap="prevMonth">
            <van-icon name="arrow-left" size="16" color="var(--icon-secondary)" />
          </view>
          <text class="text-sm font-semibold text-[#1f2937]">
            {{ currentYear }}年{{ currentMonth }}月
          </text>
          <view class="w-8 h-8 rounded-xl flex items-center justify-center"
                :style="{ background: canNextMonth ? '#f3f4f6' : '#f9fafb' }"
                @tap="nextMonth">
            <van-icon name="arrow" size="16"
                      :color="canNextMonth ? 'var(--icon-secondary)' : '#d1d5db'" />
          </view>
        </view>

        <!-- 星期表头 -->
        <view class="grid grid-cols-7 mb-2">
          <text v-for="w in weekLabels" :key="w"
                class="text-center text-xs text-[#9ca3af]">{{ w }}</text>
        </view>

        <!-- 日期格子 -->
        <view class="grid grid-cols-7" style="gap:4px 0">
          <view v-for="(day, idx) in calendarDays" :key="idx"
                class="flex items-center justify-center"
                style="height:42px"
                @tap="day && onDayTap(day)">
            <view v-if="day"
                  class="relative flex items-center justify-center"
                  style="width:34px;height:34px;border-radius:50%"
                  :style="getDayStyle(day)">
              <text class="text-xs"
                    :style="{ color: getDayTextColor(day),
                              fontWeight: isToday(day) ? '700' : '400' }">
                {{ day }}
              </text>
              <!-- 有数据圆点 -->
              <view v-if="hasRecord(day) && !isSelectedDay(day)"
                    style="position:absolute;bottom:3px;left:50%;transform:translateX(-50%);
                           width:4px;height:4px;border-radius:50%;background:#10b981"></view>
            </view>
          </view>
        </view>

      </view>

      <!-- 空提示 -->
      <view v-if="!monthRecordCount" class="card p-6">
        <van-empty description="本月暂无健康记录" image-size="80" />
      </view>

    </view>

    <!-- 日期详情底部弹窗 -->
    <van-popup
      v-model="showDetail"
      position="bottom"
      :style="{ borderRadius: '20px 20px 0 0', maxHeight: '70vh', overflowY: 'auto' }"
    >
      <view class="p-5 pb-10">

        <!-- 弹窗标题 -->
        <view class="flex items-center justify-between mb-4">
          <text class="text-base font-semibold text-[#1f2937]">
            {{ selectedDateStr }} 健康数据
          </text>
          <van-icon name="cross" size="18" color="var(--icon-secondary)" @tap="showDetail = false" />
        </view>

        <!-- 无数据 -->
        <view v-if="!selectedRecord">
          <van-empty description="当天暂无记录" image-size="80" />
          <view v-if="isSelectedToday"
                class="mt-3 h-11 rounded-xl flex items-center justify-center"
                style="background:linear-gradient(135deg,#10b981,#059669)"
                @tap="goEditToday">
            <text class="text-white font-semibold text-sm">去记录今日数据</text>
          </view>
        </view>

        <!-- 有数据 -->
        <view v-else class="flex flex-col gap-3">
          <view v-for="field in detailFields" :key="field.key" class="flex items-center gap-3">
            <view class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background:#f0fdf4">
              <van-icon :name="field.icon" size="18" color="var(--icon-primary)" />
            </view>
            <view class="flex-1">
              <text class="text-xs text-[#9ca3af] block">{{ field.label }}</text>
              <text class="text-sm font-semibold text-[#1f2937]">
                {{ getFieldValue(field.key) }}{{ field.unit }}
              </text>
            </view>
          </view>

          <!-- 饮食 -->
          <view v-if="selectedRecord.foods" class="flex items-start gap-3">
            <view class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style="background:#f0fdf4">
              <van-icon name="orders-o" size="18" color="var(--icon-primary)" />
            </view>
            <view class="flex-1">
              <text class="text-xs text-[#9ca3af] block">饮食记录</text>
              <text class="text-xs text-[#6b7280] leading-relaxed">{{ selectedRecord.foods }}</text>
            </view>
          </view>

          <!-- 今日可编辑提示 -->
          <view v-if="isSelectedToday"
                class="mt-2 h-11 rounded-xl flex items-center justify-center"
                style="background:linear-gradient(135deg,#10b981,#059669)"
                @tap="goEditToday">
            <text class="text-white font-semibold text-sm">编辑今日数据</text>
          </view>
        </view>

      </view>
    </van-popup>

  </view>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  data() {
    const now = dayjs()
    return {
      currentYear:  now.year(),
      currentMonth: now.month() + 1,
      monthData:    [],
      showDetail:   false,
      selectedDay:  null,
      detailFields: [
        { key: 'weight',       icon: 'balance-o',   label: '体重',     unit: ' kg'  },
        { key: 'calorie',      icon: 'fire-o',      label: '卡路里摄入', unit: ' kcal' },
        { key: 'stepNum',      icon: 'todo-list-o', label: '步数',     unit: ' 步'  },
        { key: 'exerciseTime', icon: 'clock-o',     label: '有氧运动', unit: ' min' },
        { key: 'sleepTime',    icon: 'moon-o',      label: '睡眠时长', unit: ''     },
      ],
    }
  },
  computed: {
    ...mapState(['user']),
    weekLabels() { return ['日','一','二','三','四','五','六'] },
    calendarDays() {
      const firstDay    = new Date(this.currentYear, this.currentMonth - 1, 1).getDay()
      const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const days = []
      for (let i = 0; i < firstDay; i++) days.push(null)
      for (let i = 1; i <= daysInMonth; i++) days.push(i)
      return days
    },
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth, 0).getDate()
    },
    canNextMonth() {
      const now = dayjs()
      return !(this.currentYear === now.year() && this.currentMonth === now.month() + 1)
    },
    // Set of day numbers (1-31) that have records this month
    recordDaySet() {
      const set = new Set()
      this.monthData.forEach(record => {
        const d = dayjs(record.created_at).date()
        set.add(d)
      })
      return set
    },
    monthRecordCount() {
      return this.recordDaySet.size
    },
    selectedRecord() {
      if (!this.selectedDay) return null
      const targetDate = this.dateStr(this.selectedDay)
      return this.monthData.find(r => dayjs(r.created_at).format('YYYY-MM-DD') === targetDate) || null
    },
    selectedDateStr() {
      if (!this.selectedDay) return ''
      return this.dateStr(this.selectedDay)
    },
    isSelectedToday() {
      if (!this.selectedDay) return false
      return this.dateStr(this.selectedDay) === dayjs().format('YYYY-MM-DD')
    },
  },
  onShow() {
    this.loadMonthData()
  },
  methods: {
    dateStr(day) {
      return `${this.currentYear}-${String(this.currentMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    },
    isToday(day) {
      return this.dateStr(day) === dayjs().format('YYYY-MM-DD')
    },
    isSelectedDay(day) {
      return this.selectedDay === day
    },
    hasRecord(day) {
      return this.recordDaySet.has(day)
    },
    getDayStyle(day) {
      if (this.isSelectedDay(day)) return 'background:#10b981'
      if (this.isToday(day))       return 'border:2px solid #10b981'
      return ''
    },
    getDayTextColor(day) {
      if (this.isSelectedDay(day)) return '#ffffff'
      if (this.isToday(day))       return '#10b981'
      return '#374151'
    },
    loadMonthData() {
      const token = this.user.token
      if (!token) return
      uni.request({
        url: `/api/data/month?year=${this.currentYear}&month=${this.currentMonth}`,
        method: 'GET',
        header: { token },
        success: res => {
          this.monthData = res.data && res.data.data ? res.data.data : []
        },
        fail: () => uni.showToast({ title: '加载失败', icon: 'none' }),
      })
    },
    onDayTap(day) {
      this.selectedDay = day
      this.showDetail  = true
    },
    prevMonth() {
      if (this.currentMonth === 1) { this.currentYear--;  this.currentMonth = 12 }
      else                          { this.currentMonth-- }
      this.selectedDay = null
      this.loadMonthData()
    },
    nextMonth() {
      if (!this.canNextMonth) return
      if (this.currentMonth === 12) { this.currentYear++;  this.currentMonth = 1 }
      else                           { this.currentMonth++ }
      this.selectedDay = null
      this.loadMonthData()
    },
    getFieldValue(key) {
      if (!this.selectedRecord) return '—'
      const val = this.selectedRecord[key]
      return val !== null && val !== undefined && val !== '' ? val : '—'
    },
    goEditToday() {
      this.showDetail = false
      uni.switchTab({ url: '/pages/index/index' })
    },
  },
}
</script>

<style scoped></style>
