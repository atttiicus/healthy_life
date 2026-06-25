<template>
  <view class="page pb-6">
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <view class="flex items-center gap-3 mb-1">
        <van-icon name="info-o" size="22" color="rgba(255,255,255,.9)" />
        <text class="text-white font-bold" style="font-size:24px">关于我们</text>
      </view>
      <text class="text-sm" style="color:rgba(255,255,255,.7)">了解更多关于健康生活</text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- 应用信息 -->
      <view class="card p-5 flex flex-col items-center gap-3">
        <view class="w-20 h-20 rounded-3xl flex items-center justify-center"
              style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
          <van-icon name="like-o" size="40" color="#fff" />
        </view>
        <text class="text-xl font-bold text-[#1f2937]">健康生活</text>
        <text class="text-sm text-[#9ca3af]">版本 1.0.0</text>
        <text class="text-sm text-[#6b7280] text-center leading-relaxed px-4">
          健康生活是一款致力于帮助用户建立健康生活方式的全功能健康管理应用，涵盖运动记录、饮食追踪、健康数据分析等核心功能。
        </text>
      </view>

      <!-- 功能亮点 -->
      <view class="card overflow-hidden">
        <view v-for="(item, idx) in features" :key="item.title"
              class="flex items-center px-4 py-4"
              :class="idx < features.length - 1 ? 'border-b border-[#f3f4f6]' : ''">
          <view class="w-8 h-8 rounded-xl flex items-center justify-center mr-3"
                :style="{ background: item.bg }">
            <van-icon :name="item.icon" size="16" :color="item.color" />
          </view>
          <text class="text-sm text-[#374151]">{{ item.title }}</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      features: [
        { icon: 'bar-chart-o',   title: '健康数据追踪与分析',   color: '#10b981', bg: '#d1fae5' },
        { icon: 'fire-o',        title: '运动记录与目标管理',   color: '#f97316', bg: '#fff7ed' },
        { icon: 'good-job-o',    title: '习惯养成打卡系统',     color: '#8b5cf6', bg: '#ede9fe' },
        { icon: 'smile-o',       title: '心情日记与情绪管理',   color: '#eab308', bg: '#fef9c3' },
        { icon: 'newspaper-o',   title: '健康资讯与专业文章',   color: '#2563eb', bg: '#dbeafe' },
      ],
    }
  },
}
</script>

<style scoped></style>
