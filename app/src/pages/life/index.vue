<template>
  <view class="page pb-8">

    <!-- 评分头部 -->
    <view class="px-5 pt-8 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">

      <text class="text-xs block mb-5" style="color:rgba(255,255,255,.7)">当前综合健康评分</text>

      <view class="flex items-center gap-6">

        <!-- 圆环 (无重复文字) -->
        <view class="relative flex-shrink-0" style="width:96px;height:96px">
          <van-circle
            v-model="currentRate"
            :rate="targetRate"
            :speed="100"
            size="96px"
            color="#ffffff"
            layer-color="rgba(255,255,255,0.2)"
            stroke-width="70"
            text=""
          />
          <!-- 中心分数 -->
          <view style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <text class="text-white font-bold" style="font-size:28px;line-height:1">{{ targetRate }}</text>
            <text style="color:rgba(255,255,255,.65);font-size:11px;margin-top:2px">/ 100</text>
          </view>
        </view>

        <!-- 说明 -->
        <view class="flex-1">
          <view class="flex items-center gap-2 mb-2">
            <view class="rounded-full px-3 py-0.5" style="background:rgba(255,255,255,.2)">
              <text class="text-white text-xs font-medium">{{ scoreLabel }}</text>
            </view>
          </view>
          <text class="text-xs leading-relaxed" style="color:rgba(255,255,255,.8)">
            {{ scoreDesc }}
          </text>
        </view>

      </view>
    </view>

    <!-- Tab + 内容 -->
    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- Tab 切换 -->
      <view class="bg-white rounded-2xl p-1 flex" style="box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <view
          v-for="tab in tabs" :key="tab"
          class="flex-1 py-2 rounded-xl text-center text-sm"
          :class="activeTab === tab ? 'bg-[#10b981] text-white font-medium' : 'text-[#6b7280]'"
          @tap="onTabChange(tab)"
        >{{ tab }}</view>
      </view>

      <text class="text-xs text-[#9ca3af]">点击下列项目查看详细报告</text>

      <!-- 2×2 数据卡 -->
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="item in healthItems" :key="item.title"
          class="card p-4"
          @tap="item.onTap && item.onTap()"
        >
          <view class="flex items-center justify-between mb-2">
            <text class="text-sm font-medium text-[#374151]">{{ item.title }}</text>
            <text class="text-xl">{{ item.icon }}</text>
          </view>
          <text class="text-xs text-[#9ca3af]">最近{{ activeTab }}</text>
          <text
            class="text-sm font-semibold block mt-1"
            :class="item.trend === 'good' ? 'text-[#10b981]' : 'text-[#f97316]'"
          >{{ item.direction }}</text>
          <text class="text-xl font-bold text-[#1f2937] block">{{ item.value }}</text>
          <text class="text-xs text-[#9ca3af] block mt-1">{{ item.tip }}</text>
        </view>
      </view>

      <!-- 睡眠质量趋势图 -->
      <view class="card p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="sec-title">睡眠质量趋势</text>
          <text class="text-xs text-[#9ca3af]">{{ activeTab }}数据</text>
        </view>
        <view id="lifeCharts" style="width:100%;height:180px"></view>
      </view>

    </view>

    <!-- 报告弹窗 -->
    <van-popup
      v-model="isShowDia"
      closeable
      position="bottom"
      :style="{ height: '60%', borderRadius: '20px 20px 0 0' }"
    >
      <view class="p-5">
        <text class="text-lg font-semibold text-[#1f2937] block mb-4">
          最近{{ activeTab }}体重报告
        </text>
        <text class="text-sm text-[#6b7280] block mb-2">单项评分</text>
        <van-progress :percentage="87" pivot-text="87" stroke-width="8" color="#10b981" />
        <view class="mt-4 rounded-xl p-4 bg-[#f9fafb]">
          <text class="text-sm text-[#374151] leading-relaxed">
            本周体重整体呈下降趋势，健康状况良好，请继续保持当前的饮食习惯和运动计划。
          </text>
        </view>
      </view>
    </van-popup>

  </view>
</template>

<script>
import dayjs from 'dayjs'

const BASE = '2024-01-01 '

// 生成周报数据（最近7天）
function weekData() {
  const times  = ['07:15', '06:30', '07:10', '06:50', '07:35', '06:55', '07:20']
  const xData  = []
  const yData  = []
  for (let i = 6; i >= 0; i--) {
    xData.push(dayjs().subtract(i, 'day').format('MMDD'))
    yData.push(BASE + times[6 - i])
  }
  return { xData, yData }
}

// 生成月报数据（最近4周均值）
function monthData() {
  const times = ['07:05', '06:48', '07:22', '07:10']
  return {
    xData: ['第1周', '第2周', '第3周', '第4周'],
    yData: times.map(t => BASE + t),
  }
}

// 生成年报数据（最近12个月均值）
function yearData() {
  const times = [
    '06:45', '06:52', '07:05', '07:20', '07:15', '07:10',
    '06:55', '07:00', '07:18', '07:08', '06:50', '07:20',
  ]
  return {
    xData: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    yData: times.map(t => BASE + t),
  }
}

const DATA_MAP = { 周报: weekData, 月报: monthData, 年报: yearData }

export default {
  data() {
    return {
      isShowDia: false,
      currentRate: 0,
      targetRate: 76,
      activeTab: '周报',
      tabs: ['周报', '月报', '年报'],
      _chart: null,
    }
  },
  computed: {
    text() { return this.currentRate.toFixed(0) },
    scoreLabel() {
      const s = this.targetRate
      if (s >= 90) return '优秀'
      if (s >= 75) return '良好'
      if (s >= 60) return '中等'
      return '较差'
    },
    scoreDesc() {
      const s = this.targetRate
      if (s >= 90) return '健康状况非常好，请继续保持！'
      if (s >= 75) return '评分良好，主要改善睡眠问题，建议晚上11点前入睡。'
      if (s >= 60) return '评分中等，主要改善体重与睡眠问题，建议饭后多运动，晚上11点前入睡。'
      return '健康状况需要关注，请合理安排饮食与运动。'
    },
    healthItems() {
      const tab = this.activeTab
      return [
        { title: '体重变化', icon: '⚖️', direction: '↓ 下降', value: '1.1 KG',  tip: '需要再接再厉', trend: 'good', onTap: () => this.showDataReport() },
        { title: '运动锻炼', icon: '🏋️', direction: '↑ 增长', value: '22 min',  tip: '运动后记得放松', trend: 'good', onTap: () => this.showDataReport() },
        { title: '睡眠质量', icon: '😴', direction: tab === '年报' ? '↑ 改善' : '↓ 减少', value: tab === '年报' ? '8 min' : '11 min', tip: '注意改善睡眠', trend: tab === '年报' ? 'good' : 'bad' },
        { title: '饮食健康', icon: '🥗', direction: '↑ 增加', value: tab === '年报' ? '150 kcal' : '200 kcal', tip: '合理增加饮食', trend: 'good' },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.renderChart())
  },
  methods: {
    onTabChange(tab) {
      this.activeTab = tab
      this.$nextTick(() => this.renderChart())
    },
    showDataReport() { this.isShowDia = true },
    renderChart() {
      const el = document.getElementById('lifeCharts')
      if (!el) return
      if (!this._chart) {
        this._chart = this.$echarts.init(el)
      }
      const { xData, yData } = DATA_MAP[this.activeTab]()
      this._chart.setOption({
        grid: { top: 8, bottom: 28, left: 8, right: 12, containLabel: true },
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
          minInterval: 30 * 60 * 1000,
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
      }, true)
    },
  },
}
</script>

<style scoped></style>
