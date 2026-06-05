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
            :rate="healthScore"
            :speed="100"
            size="96px"
            color="#ffffff"
            layer-color="rgba(255,255,255,0.2)"
            stroke-width="70"
            text=""
          />
          <!-- 中心分数 -->
          <view style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <text class="text-white font-bold" style="font-size:28px;line-height:1">{{ healthScore }}</text>
            <text style="color:rgba(255,255,255,.65);font-size:11px;margin-top:2px">/ 100</text>
          </view>
        </view>

        <!-- 说明 -->
        <view class="flex-1">
          <view class="flex items-center gap-2 mb-2">
            <view class="rounded-full px-3 py-0.5" style="background:rgba(255,255,255,.2)">
              <text class="text-white text-xs font-medium">{{ scoreBadge.label }}</text>
            </view>
          </view>
          <text class="text-xs leading-relaxed" style="color:rgba(255,255,255,.8)">
            {{ scoreBadge.desc }}
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
            <van-icon :name="item.icon" size="22" color="var(--icon-secondary)" />
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
        <view v-if="historyData.length" id="lifeCharts" style="width:100%;height:180px"></view>
        <view v-else class="flex flex-col items-center justify-center py-6">
          <van-empty
            description="暂无睡眠数据"
            image-size="80"
          />
          <text class="text-xs text-[#9ca3af] mt-1">记录今日数据后即可查看趋势</text>
        </view>
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
        <van-progress :percentage="healthScore" :pivot-text="healthScore + '分'" stroke-width="8" color="#10b981" />
        <view class="mt-4 rounded-xl p-4 bg-[#f9fafb]">
          <text class="text-sm text-[#374151] leading-relaxed">{{ reportSummary }}</text>
        </view>
      </view>
    </van-popup>

  </view>
</template>

<script>
import dayjs from 'dayjs'
import { mapState, mapGetters } from 'vuex'

const BASE = '2024-01-01 '
const TAB_DAYS = { 周报: 7, 月报: 30, 年报: 90 }

export default {
  data() {
    return {
      isShowDia: false,
      currentRate: 0,
      activeTab: '周报',
      tabs: ['周报', '月报', '年报'],
      _chart: null,
      historyData: [],
    }
  },
  computed: {
    ...mapState(['currentData', 'userPlanData', 'user']),
    ...mapGetters(['healthScore', 'scoreBadge']),

    text() { return this.currentRate.toFixed(0) },

    // 健康数据卡片（基于真实数据计算进度）
    healthItems() {
      const cd = this.currentData
      const pd = this.userPlanData

      // 体重：当前 vs 目标
      const curW  = Number(cd.weight) || null
      const planW = Number(pd.weight) || null
      const wDiff = curW && planW ? (curW - planW).toFixed(1) : null
      const wGood = wDiff !== null && Number(wDiff) <= 0

      // 运动：达成率
      const exCur  = Number(cd.exerciseTime) || 0
      const exPlan = Number(pd.exerciseTime) || 40
      const exPct  = Math.round(exCur / exPlan * 100)

      // 睡眠：与目标时长比较
      const sleepCur  = cd.sleepTime  || null
      const sleepPlan = pd.sleepTime  || '07:30'
      let sleepDiff = null, sleepGood = true
      if (sleepCur && sleepPlan) {
        const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0) }
        sleepDiff = toMin(sleepCur) - toMin(sleepPlan)
        sleepGood = sleepDiff >= -30 // 不低于目标 30 分钟内算良好
      }

      // 卡路里
      const calCur  = Number(cd.calorie) || 0
      const calPlan = Number(pd.calorie) || 2000
      const calPct  = Math.round(calCur / calPlan * 100)
      const calGood = calPct >= 80 && calPct <= 110

      return [
        {
          title: '体重管理', icon: 'balance-o',
          direction: wDiff !== null ? (Number(wDiff) <= 0 ? '↓ 低于目标' : `↑ 超出 ${wDiff}kg`) : '暂无数据',
          value: curW ? `${curW} kg` : '—',
          tip: planW ? `目标 ${planW} kg` : '尚未设定目标',
          trend: wGood ? 'good' : 'bad',
          onTap: () => this.showDataReport(),
        },
        {
          title: '运动锻炼', icon: 'fire-o',
          direction: exPct >= 100 ? '已达标' : `达成 ${exPct}%`,
          value: `${exCur} min`,
          tip: `目标 ${exPlan} min`,
          trend: exPct >= 80 ? 'good' : 'bad',
          onTap: () => this.showDataReport(),
        },
        {
          title: '睡眠质量', icon: 'clock-o',
          direction: sleepDiff !== null
            ? (sleepGood ? '睡眠达标' : `少 ${Math.abs(sleepDiff)} 分钟`)
            : '暂无数据',
          value: sleepCur || '—',
          tip: `目标 ${sleepPlan}`,
          trend: sleepGood ? 'good' : 'bad',
        },
        {
          title: '热量摄入', icon: 'hot-o',
          direction: calGood ? '摄入适中' : (calPct > 110 ? '摄入超标' : '摄入不足'),
          value: `${calCur} kcal`,
          tip: `目标 ${calPlan} kcal`,
          trend: calGood ? 'good' : 'bad',
        },
      ]
    },

    // 报告弹窗：综合进度汇总
    reportSummary() {
      const cd = this.currentData
      const pd = this.userPlanData
      const lines = []
      if (cd.weight && pd.weight)
        lines.push(`体重 ${cd.weight}kg（目标 ${pd.weight}kg）`)
      if (cd.exerciseTime && pd.exerciseTime)
        lines.push(`运动 ${cd.exerciseTime}min（目标 ${pd.exerciseTime}min）`)
      if (cd.sleepTime)
        lines.push(`睡眠 ${cd.sleepTime}（目标 ${pd.sleepTime || '07:30'}）`)
      if (cd.calorie && pd.calorie)
        lines.push(`热量 ${cd.calorie}kcal（目标 ${pd.calorie}kcal）`)
      return lines.length
        ? lines.join('，') + '。'
        : '暂无今日健康数据，请先记录数据再查看报告。'
    },
  },
  mounted() {
    this.fetchHistory()
  },
  methods: {
    fetchHistory() {
      const { token } = this.user
      if (!token) { this.$nextTick(() => this.renderChart()); return }
      const days = TAB_DAYS[this.activeTab]
      uni.request({
        url: `/api/data/history?days=${days}`,
        method: 'GET',
        header: { token },
        success: (res) => {
          this.historyData = res.data?.data || []
          this.$nextTick(() => this.renderChart())
        },
        fail: () => {
          this.historyData = []
          this.$nextTick(() => this.renderChart())
        },
      })
    },
    onTabChange(tab) {
      this.activeTab = tab
      this.fetchHistory()
    },
    showDataReport() { this.isShowDia = true },
    renderChart() {
      const el = document.getElementById('lifeCharts')
      if (!el) return
      if (!this._chart) {
        this._chart = this.$echarts.init(el)
      }
      const xData = this.historyData.map(r => dayjs(r.created_at).format('MM-DD'))
      const yData = this.historyData.map(r => r.sleepTime ? BASE + r.sleepTime : null)
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
