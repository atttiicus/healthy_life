<template>
  <view class="page pb-6">
    <!-- 通知栏 -->
    <view class="flex items-center gap-2 px-4 py-2 bg-[#fff7ed]">
      <text class="text-[#ea580c] text-sm">ℹ</text>
      <text class="text-[#ea580c] text-xs">每日数据需要手动更新才能保证数据准确性哦。</text>
    </view>

    <view class="p-4 flex flex-col gap-4">

      <!-- 体重主卡 -->
      <view class="rounded-2xl p-5 overflow-hidden"
            style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
        <view class="flex items-start justify-between">
          <view>
            <view class="flex items-end gap-1">
              <text class="font-bold text-white" style="font-size:52px;line-height:1">
                {{ currentData.weight || '—' }}
              </text>
              <text class="text-white text-xl mb-1">KG</text>
            </view>
            <text class="text-xs mt-1" style="color:rgba(255,255,255,.65)">{{ currentTime }}</text>
          </view>
          <view class="flex flex-col items-end gap-3">
            <view class="w-10 h-10 rounded-xl flex items-center justify-center"
                  style="background:rgba(255,255,255,.2)"
                  @tap="popUpdateDayDataDialog">
              <text class="text-white text-xl">↻</text>
            </view>
            <view class="text-right">
              <text class="text-white text-sm font-medium">↓ 0.5 kg</text>
              <text class="text-xs block" style="color:rgba(255,255,255,.6)">较昨日下降</text>
            </view>
          </view>
        </view>
        <!-- BMI / 体脂率 -->
        <view class="flex gap-3 mt-4">
          <view class="flex-1 rounded-xl p-3 text-center"
                style="background:rgba(255,255,255,.15)">
            <text class="text-xs" style="color:rgba(255,255,255,.7)">BMI</text>
            <view class="flex items-center justify-center gap-1 mt-1">
              <text class="text-white text-lg font-bold">{{ bmi.value }}</text>
              <view class="rounded-full px-2 py-0.5" style="background:rgba(255,255,255,.25)">
                <text class="text-white text-xs">{{ bmi.label }}</text>
              </view>
            </view>
          </view>
          <view class="flex-1 rounded-xl p-3 text-center"
                style="background:rgba(255,255,255,.15)">
            <text class="text-xs" style="color:rgba(255,255,255,.7)">体脂率</text>
            <view class="flex items-center justify-center gap-1 mt-1">
              <text class="text-white text-lg font-bold">{{ brf.value }}</text>
              <view class="rounded-full px-2 py-0.5" style="background:rgba(255,255,255,.25)">
                <text class="text-white text-xs">{{ brf.label }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 今日卡路里 -->
      <view class="card p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="sec-title">今日卡路里</text>
          <text class="text-xs text-[#10b981]">目标 {{ userPlanData.calorie || '--' }} kcal</text>
        </view>
        <view class="flex items-center gap-4">
          <view class="relative flex-shrink-0" style="width:72px;height:72px">
            <view class="w-full h-full rounded-full flex items-center justify-center"
                  :style="{ background: calorieRing }">
              <view class="rounded-full bg-white flex items-center justify-center"
                    style="width:52px;height:52px">
                <text class="text-xs font-bold text-[#10b981]">{{ caloriePercent }}</text>
              </view>
            </view>
          </view>
          <view class="flex-1">
            <view class="flex items-baseline gap-1">
              <text class="text-2xl font-bold text-[#1f2937]">{{ currentData.calorie || 0 }}</text>
              <text class="text-sm text-[#9ca3af]">kcal</text>
            </view>
            <view class="h-2 bg-[#f3f4f6] rounded-full overflow-hidden mt-2">
              <view class="h-2 bg-[#10b981] rounded-full"
                    :style="{ width: calorieWidthPct }"></view>
            </view>
            <view class="flex flex-wrap gap-1 mt-2">
              <view v-for="food in foods" :key="food" class="tag-green">
                <text class="text-xs text-[#059669]">{{ food }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 运动双卡 -->
      <view class="flex gap-3">
        <view class="flex-1 card p-4">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-8 h-8 bg-[#fff7ed] rounded-xl flex items-center justify-center">
              <text>🏃</text>
            </view>
            <text class="text-sm font-medium text-[#374151]">步数</text>
          </view>
          <text class="text-xl font-bold text-[#1f2937]">{{ currentData.stepNum || 0 }}</text>
          <text class="text-xs text-[#9ca3af] block mb-2">
            / {{ userPlanData.kilometre || '--' }} 步
          </text>
          <view class="h-1.5 bg-[#fff7ed] rounded-full overflow-hidden">
            <view class="h-1.5 bg-[#f97316] rounded-full"
                  :style="{ width: stepWidthPct }"></view>
          </view>
        </view>
        <view class="flex-1 card p-4">
          <view class="flex items-center gap-2 mb-3">
            <view class="w-8 h-8 bg-[#ecfdf5] rounded-xl flex items-center justify-center">
              <text>⏱</text>
            </view>
            <text class="text-sm font-medium text-[#374151]">有氧运动</text>
          </view>
          <text class="text-xl font-bold text-[#1f2937]">{{ currentData.exerciseTime || 0 }}</text>
          <text class="text-xs text-[#9ca3af] block mb-2">
            / {{ userPlanData.exerciseTime || '--' }} min
          </text>
          <view class="h-1.5 bg-[#ecfdf5] rounded-full overflow-hidden">
            <view class="h-1.5 bg-[#10b981] rounded-full"
                  :style="{ width: exerciseWidthPct }"></view>
          </view>
        </view>
      </view>

      <!-- 睡眠 -->
      <view class="card p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="sec-title">睡眠质量趋势</text>
          <text class="text-xs text-[#9ca3af]">近 5 日</text>
        </view>
        <view id="sheepEcharts" style="width:100%;height:200px"></view>
      </view>

    </view>

    <DialogDayData
      v-if="isShowCommonDialog"
      :isShowCommonDialog="isShowCommonDialog"
      @UpdateDialogDayDataState="UpdateDialogDayDataState"
    />
  </view>
</template>

<script>
import dayjs from 'dayjs'
import DialogDayData from '@/components/dialog/dialogDayData.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  components: { DialogDayData },
  data() {
    return {
      isShowCommonDialog: false,
      currentTime: '',
    }
  },
  computed: {
    ...mapState(['user', 'currentData', 'userPlanData']),
    foods() {
      if (!this.currentData.foods) return []
      return String(this.currentData.foods).split(',').slice(0, 4).filter(Boolean)
    },
    caloriePercent() {
      const curr = Number(this.currentData.calorie) || 0
      const target = Number(this.userPlanData.calorie) || 0
      if (!target) return '0%'
      return Math.min(100, Math.round(curr / target * 100)) + '%'
    },
    calorieWidthPct() { return this.caloriePercent },
    calorieRing() {
      const p = parseInt(this.caloriePercent) || 0
      return `conic-gradient(#10b981 0% ${p}%, #e5e7eb ${p}% 100%)`
    },
    stepWidthPct() {
      const curr = Number(this.currentData.stepNum) || 0
      const target = Number(this.userPlanData.kilometre) || 0
      if (!target) return '0%'
      return Math.min(100, Math.round(curr / target * 100)) + '%'
    },
    exerciseWidthPct() {
      const curr = Number(this.currentData.exerciseTime) || 0
      const target = Number(this.userPlanData.exerciseTime) || 0
      if (!target) return '0%'
      return Math.min(100, Math.round(curr / target * 100)) + '%'
    },

    // BMI = 体重(kg) / 身高(m)²
    bmi() {
      const w = Number(this.currentData.weight) || Number(this.user.weight)
      const h = Number(this.user.height)
      if (!w || !h) return { value: '—', label: '未知' }
      const val = w / Math.pow(h / 100, 2)
      const v = val.toFixed(1)
      let label = '正常'
      if (val < 18.5)      label = '偏瘦'
      else if (val < 25)   label = '正常'
      else if (val < 30)   label = '偏胖'
      else                 label = '肥胖'
      return { value: v, label }
    },

    // 体脂率：Deurenberg 公式
    // BRF = (1.2 × BMI) + (0.23 × 年龄) - (10.8 × 性别系数) - 5.4
    // 性别系数：男=1，女=0
    brf() {
      const bmiVal = parseFloat(this.bmi.value)
      if (isNaN(bmiVal)) return { value: '—', label: '未知' }
      const age = Number(this.user.age) || 25
      const isMale = String(this.user.sex).trim() === '男'
      const val = (1.2 * bmiVal) + (0.23 * age) - (10.8 * (isMale ? 1 : 0)) - 5.4
      const v = val.toFixed(1) + '%'
      let label = '正常'
      if (isMale) {
        if (val < 10)      label = '偏瘦'
        else if (val < 20) label = '正常'
        else if (val < 25) label = '偏胖'
        else               label = '肥胖'
      } else {
        if (val < 20)      label = '偏瘦'
        else if (val < 30) label = '正常'
        else if (val < 35) label = '偏胖'
        else               label = '肥胖'
      }
      return { value: v, label }
    },
  },
  mounted() {
    this.initSheepEchartsTable()
  },
  onLoad() {
    if (JSON.stringify(this.currentData) === '{}' && this.user.uid) {
      uni.request({
        url: `/api/data/find?uid=${this.user.uid}`,
        method: 'GET',
        header: { token: this.user.token },
        success: (res) => {
          if (res.data.data) { this.setCurrentData(res.data.data); return }
          this.isShowCommonDialog = true
        },
      })
    }
    this.currentTime = dayjs().format('MM月DD日 HH:mm')
    setInterval(() => { this.currentTime = dayjs().format('MM月DD日 HH:mm') }, 60000)
  },
  methods: {
    ...mapMutations(['setCurrentData']),
    popUpdateDayDataDialog() { this.isShowCommonDialog = true },
    UpdateDialogDayDataState(v) { this.isShowCommonDialog = v },
    initSheepEchartsTable() {
      const el = document.getElementById('sheepEcharts')
      if (!el) return

      // 生成最近 7 天的日期标签和 mock 睡眠时长
      const mockTimes = ['07:15', '06:30', '07:10', '06:50', '07:35', '06:55', '07:20']
      const todaySleep = this.currentData.sleepTime || '07:20'
      const xData = []
      const yData = []
      const BASE = '2024-01-01 '   // 固定日期前缀，仅取时间部分

      for (let i = 6; i >= 0; i--) {
        const d = dayjs().subtract(i, 'day')
        xData.push(d.format('MMDD'))
        yData.push(BASE + (i === 0 ? todaySleep : mockTimes[6 - i]))
      }

      const chart = this.$echarts.init(el)
      chart.setOption({
        grid: { top: 8, bottom: 28, left: 52, right: 12 },
        xAxis: {
          type: 'category',
          data: xData,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#f3f4f6' } },
          axisTick: { show: false },
          axisLabel: { color: '#9ca3af', fontSize: 10 },
        },
        yAxis: {
          type: 'time',
          min: BASE + '06:00',
          max: BASE + '08:00',
          minInterval: 30 * 60 * 1000,   // 最小间隔 30 分钟，避免刻度过密
          axisLabel: {
            formatter: v => dayjs(v).format('HH:mm'),
            color: '#9ca3af',
            fontSize: 10,
          },
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        },
        series: [{
          data: yData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#10b981', width: 2.5 },
          itemStyle: { color: '#10b981', borderColor: '#fff', borderWidth: 2 },
          areaStyle: { color: 'rgba(16,185,129,.08)' },
        }],
      })
    },
  },
}
</script>

<style scoped></style>
