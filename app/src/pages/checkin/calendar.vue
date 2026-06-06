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
          <text class="text-white font-bold block" style="font-size:24px">
            {{ monthCheckinCount }}
          </text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">本月打卡</text>
        </view>
        <view class="text-center">
          <text class="text-white font-bold block" style="font-size:24px">
            {{ streakData.streak || 0 }}
          </text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">连续天数</text>
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
        <view class="grid grid-cols-7" style="gap: 4px 0">
          <view v-for="(day, idx) in calendarDays" :key="idx"
                class="flex items-center justify-center"
                style="height:38px">
            <view v-if="day"
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :style="getDayStyle(day)">
              <text class="text-xs"
                    :style="{ color: getDayTextColor(day),
                              fontWeight: isToday(day) ? '700' : '400' }">
                {{ day }}
              </text>
            </view>
          </view>
        </view>

      </view>

      <!-- 今日打卡区 -->
      <view class="card p-4">
        <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-3">
          今日打卡
        </text>

        <view v-if="todayChecked"
              class="flex items-center justify-center gap-2 py-3 rounded-xl"
              style="background:#f0fdf4">
          <van-icon name="success" size="18" color="var(--icon-primary)" />
          <text class="text-sm font-semibold" style="color:var(--icon-primary)">今日已打卡</text>
        </view>

        <view v-else class="flex flex-col gap-3">
          <view class="input-wrap">
            <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                   v-model="note"
                   placeholder="打卡备注（选填）"
                   placeholder-style="color:#9ca3af" />
          </view>
          <view class="h-11 rounded-xl flex items-center justify-center"
                style="background:linear-gradient(135deg,#10b981,#059669)"
                @tap="doCheckin">
            <text class="text-white font-semibold text-sm">今日打卡</text>
          </view>
        </view>
      </view>

    </view>
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
      checkedDates: [],
      streakData:   { streak: 0, last_checkin: null },
      note:         '',
      loading:      false,
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
    monthCheckinCount() {
      const prefix = `${this.currentYear}-${String(this.currentMonth).padStart(2,'0')}`
      return this.checkedDates.filter(d => d.startsWith(prefix)).length
    },
    todayChecked() {
      return this.checkedDates.includes(dayjs().format('YYYY-MM-DD'))
    },
    canNextMonth() {
      const now = dayjs()
      return !(this.currentYear === now.year() && this.currentMonth === now.month() + 1)
    },
  },
  onShow() {
    this.loadData()
  },
  methods: {
    dateStr(day) {
      return `${this.currentYear}-${String(this.currentMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    },
    isToday(day) {
      return this.dateStr(day) === dayjs().format('YYYY-MM-DD')
    },
    isChecked(day) {
      return this.checkedDates.includes(this.dateStr(day))
    },
    getDayStyle(day) {
      if (this.isChecked(day)) return 'background:#10b981'
      if (this.isToday(day))   return 'border:2px solid #10b981'
      return ''
    },
    getDayTextColor(day) {
      if (this.isChecked(day)) return '#ffffff'
      if (this.isToday(day))   return '#10b981'
      return '#374151'
    },
    loadData() {
      const token = this.user.token
      if (!token) return
      Promise.all([
        new Promise(resolve => uni.request({
          url: `/api/checkin/calendar?year=${this.currentYear}&month=${this.currentMonth}`,
          method: 'GET',
          header: { token },
          success: res => resolve(res.data?.data || []),
          fail:    () => resolve([]),
        })),
        new Promise(resolve => uni.request({
          url: '/api/checkin/streak',
          method: 'GET',
          header: { token },
          success: res => resolve(res.data?.data || { streak: 0, last_checkin: null }),
          fail:    () => resolve({ streak: 0, last_checkin: null }),
        })),
      ]).then(([dates, streak]) => {
        this.checkedDates = dates
        this.streakData   = streak
      })
    },
    loadCalendar() {
      const token = this.user.token
      if (!token) return
      uni.request({
        url: `/api/checkin/calendar?year=${this.currentYear}&month=${this.currentMonth}`,
        method: 'GET',
        header: { token },
        success: res => {
          const newDates = res.data?.data || []
          const prefix   = `${this.currentYear}-${String(this.currentMonth).padStart(2,'0')}`
          const others   = this.checkedDates.filter(d => !d.startsWith(prefix))
          this.checkedDates = [...others, ...newDates]
        },
      })
    },
    prevMonth() {
      if (this.currentMonth === 1) { this.currentYear--;  this.currentMonth = 12 }
      else                          { this.currentMonth-- }
      this.loadCalendar()
    },
    nextMonth() {
      if (!this.canNextMonth) return
      if (this.currentMonth === 12) { this.currentYear++;  this.currentMonth = 1 }
      else                           { this.currentMonth++ }
      this.loadCalendar()
    },
    doCheckin() {
      if (this.loading) return
      this.loading = true
      uni.request({
        url:    '/api/checkin/do',
        method: 'POST',
        header: { token: this.user.token, 'content-type': 'application/json' },
        data:   { note: this.note },
        success: (res) => {
          if (res.data?.code === 20000) {
            this.note = ''
            uni.showToast({ title: '打卡成功', icon: 'none', duration: 1500 })
            this.loadData()
          } else {
            uni.showToast({ title: res.data?.message || '打卡失败', icon: 'none', duration: 2000 })
          }
        },
        fail:     () => uni.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 }),
        complete: () => { this.loading = false },
      })
    },
  },
}
</script>

<style scoped></style>
