<template>
  <view class="page pb-6">

    <!-- 评分头部卡 -->
    <view class="px-5 pt-8 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-xs block mb-4" style="color:rgba(255,255,255,.7)">当前综合健康评分</text>
      <view class="flex items-center gap-5">
        <van-circle
          v-model="currentRate"
          :rate="targetRate"
          :speed="100"
          size="100px"
          color="#ffffff"
          layer-color="rgba(255,255,255,0.25)"
          stroke-width="60"
          :text="text"
          :style="{ '--van-circle-text-color': '#fff', '--van-circle-text-font-size': '24px', '--van-circle-text-font-weight': '700' }"
        />
        <view class="flex-1">
          <text class="text-white font-bold" style="font-size:40px;line-height:1">
            {{ targetRate }}
          </text>
          <text class="text-xs block mt-1" style="color:rgba(255,255,255,.6)">/ 100 分</text>
          <text class="text-xs block mt-3 leading-relaxed"
                style="color:rgba(255,255,255,.8)">
            评分中等，主要改善体重与睡眠问题，建议饭后多运动，晚上11点前入睡。
          </text>
        </view>
      </view>
    </view>

    <!-- Tab + 内容区 -->
    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- Tab -->
      <view class="bg-white rounded-2xl p-1 flex" style="box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <view
          v-for="tab in tabs" :key="tab"
          class="flex-1 py-2 rounded-xl text-center text-sm"
          :class="activeTab === tab
            ? 'bg-[#10b981] text-white font-medium'
            : 'text-[#6b7280]'"
          @tap="activeTab = tab"
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
export default {
  data() {
    return {
      isShowDia: false,
      currentRate: 0,
      targetRate: 76,
      activeTab: '周报',
      tabs: ['周报', '月报', '年报'],
    }
  },
  computed: {
    text() { return this.currentRate.toFixed(0) },
    healthItems() {
      return [
        { title: '体重变化', icon: '⚖️', direction: '↓ 下降', value: '1.1 KG',
          tip: '需要再接再厉', trend: 'good', onTap: () => this.showDataReport(1) },
        { title: '运动锻炼', icon: '🏋️', direction: '↑ 增长', value: '22 min',
          tip: '运动后记得放松', trend: 'good', onTap: () => this.showDataReport(2) },
        { title: '睡眠质量', icon: '😴', direction: '↓ 减少', value: '11 min',
          tip: '注意改善睡眠', trend: 'bad' },
        { title: '饮食健康', icon: '🥗', direction: '↑ 增加', value: '200 kcal',
          tip: '合理增加饮食', trend: 'good' },
      ]
    },
  },
  methods: {
    showDataReport() { this.isShowDia = true },
  },
}
</script>

<style scoped></style>
