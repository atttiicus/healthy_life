<template>
  <view class="min-h-[calc(100vh-44px)] bg-[#f5f7fa]">

    <!-- 顶部渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:24px">健康报告</text>
      <text class="text-sm block mt-1" style="color:rgba(255,255,255,.7)">
        {{ today }} · 综合健康评估
      </text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4 pb-8">

      <!-- 综合评分卡 -->
      <view class="card p-5" style="box-shadow:0 4px 16px rgba(0,0,0,.08)">
        <view class="flex items-center gap-5">
          <view class="relative flex-shrink-0" style="width:88px;height:88px">
            <van-circle
              v-model="animRate"
              :rate="healthScore"
              :speed="80"
              size="88px"
              color="#10b981"
              layer-color="#f3f4f6"
              stroke-width="60"
              text=""
            />
            <view style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
              <text class="font-bold text-[#1f2937]" style="font-size:26px;line-height:1">
                {{ healthScore }}
              </text>
              <text class="text-[#9ca3af]" style="font-size:10px;margin-top:2px">/ 100</text>
            </view>
          </view>
          <view class="flex-1">
            <view class="flex items-center gap-2 mb-2">
              <view class="px-3 py-1 rounded-full"
                    :style="{ background: scoreBadge.bg }">
                <text class="text-xs font-semibold"
                      :style="{ color: scoreBadge.color }">
                  {{ scoreBadge.label }}
                </text>
              </view>
            </view>
            <text class="text-sm text-[#6b7280] leading-relaxed block">
              {{ scoreBadge.desc }}
            </text>
          </view>
        </view>
      </view>

      <!-- 各项指标 -->
      <view class="card overflow-hidden">
        <view class="px-4 pt-4 pb-2">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
            各项指标详情
          </text>
        </view>
        <view v-for="(item, idx) in metrics" :key="item.label">
          <view class="flex items-center px-4 py-3 gap-3">
            <view class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  :style="{ background: item.iconBg }">
              <van-icon :name="item.icon" size="16" :color="item.iconColor" />
            </view>
            <view class="flex-1">
              <view class="flex items-center justify-between mb-1">
                <text class="text-sm font-medium text-[#374151]">{{ item.label }}</text>
                <text class="text-xs font-semibold"
                      :style="{ color: item.status === 'good' ? '#10b981' : '#f97316' }">
                  {{ item.statusText }}
                </text>
              </view>
              <view class="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                <view class="h-1.5 rounded-full"
                      :style="{ width: item.pct + '%', background: item.status === 'good' ? '#10b981' : '#f97316' }">
                </view>
              </view>
              <text class="text-xs text-[#9ca3af] block mt-1">{{ item.detail }}</text>
            </view>
          </view>
          <view v-if="idx < metrics.length - 1"
                class="mx-4" style="height:1px;background:#f3f4f6"></view>
        </view>
      </view>

      <!-- 健康建议 -->
      <view class="card p-4">
        <view class="flex items-center gap-2 mb-3">
          <van-icon name="info-o" size="14" color="var(--icon-primary)" />
          <text class="sec-title">健康建议</text>
        </view>
        <view v-if="advice.length" class="flex flex-col gap-2">
          <view v-for="tip in healthAdvice" :key="tip.text"
                class="flex items-start gap-2 rounded-xl px-3 py-2"
                :style="{ background: tip.bg }">
            <van-icon :name="tip.icon" size="14" :color="tip.color"
                      class="flex-shrink-0 mt-0.5" />
            <text class="text-xs leading-relaxed flex-1"
                  :style="{ color: tip.color }">{{ tip.text }}</text>
          </view>
        </view>
        <text v-else class="text-sm text-[#9ca3af]">
          暂无今日数据，请先记录健康数据后查看建议。
        </text>
      </view>

    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
const { mapState, mapGetters } = require('vuex')

export default {
  data() {
    return { animRate: 0 }
  },
  computed: {
    ...mapState(['user', 'currentData', 'userPlanData']),
    ...mapGetters(['healthScore', 'scoreBadge', 'healthAdvice']),

    today() {
      return dayjs().format('YYYY年MM月DD日')
    },

    metrics() {
      const cd = this.currentData || {}
      const pd = this.userPlanData || {}
      const items = []

      const calCur  = Number(cd.calorie) || 0
      const calPlan = Number(pd.calorie) || 2000
      const calPct  = Math.min(100, Math.round(calCur / calPlan * 100))
      const calGood = calPct >= 80 && calPct <= 110
      items.push({
        label: '热量摄入', icon: 'fire-o', iconColor: '#f97316', iconBg: '#fff7ed',
        pct: calPct, status: calGood ? 'good' : 'bad',
        statusText: calGood ? '摄入适中' : calPct > 110 ? '摄入超标' : '摄入不足',
        detail: `${calCur} kcal / 目标 ${calPlan} kcal`,
      })

      const stepCur  = Number(cd.stepNum) || 0
      const stepPlan = Number(pd.kilometre) || 0
      const stepPct  = stepPlan ? Math.min(100, Math.round(stepCur / stepPlan * 100)) : 0
      items.push({
        label: '今日步数', icon: 'todo-list-o', iconColor: '#f97316', iconBg: '#fff7ed',
        pct: stepPct, status: stepPct >= 80 ? 'good' : 'bad',
        statusText: stepPct >= 100 ? '已达标' : `达成 ${stepPct}%`,
        detail: `${stepCur} 步 / 目标 ${stepPlan || '--'} 步`,
      })

      const exCur  = Number(cd.exerciseTime) || 0
      const exPlan = Number(pd.exerciseTime) || 40
      const exPct  = Math.min(100, Math.round(exCur / exPlan * 100))
      items.push({
        label: '运动时长', icon: 'clock-o', iconColor: '#10b981', iconBg: '#d1fae5',
        pct: exPct, status: exPct >= 80 ? 'good' : 'bad',
        statusText: exPct >= 100 ? '已达标' : `达成 ${exPct}%`,
        detail: `${exCur} min / 目标 ${exPlan} min`,
      })

      if (cd.sleepTime) {
        const [hh, mm] = cd.sleepTime.split(':').map(Number)
        const mins = hh * 60 + (mm || 0)
        const planMins = (() => {
          if (!pd.sleepTime) return 450
          const [ph, pm] = pd.sleepTime.split(':').map(Number)
          return ph * 60 + (pm || 0)
        })()
        const sleepPct = Math.min(100, Math.round(mins / planMins * 100))
        items.push({
          label: '睡眠时长', icon: 'moon-o', iconColor: '#7c3aed', iconBg: '#ede9fe',
          pct: sleepPct, status: sleepPct >= 80 ? 'good' : 'bad',
          statusText: sleepPct >= 90 ? '睡眠充足' : '睡眠不足',
          detail: `${cd.sleepTime} / 目标 ${pd.sleepTime || '07:30'}`,
        })
      }

      return items
    },

  },
}
</script>

<style scoped></style>
