<template>
  <view class="min-h-[calc(100vh-44px)] bg-[#f5f7fa]">

    <!-- 顶部渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <view class="flex items-center gap-3 mb-1">
        <van-icon name="bullhorn-o" size="22" color="rgba(255,255,255,.9)" />
        <text class="text-white font-bold" style="font-size:24px">官方公告</text>
      </view>
      <text class="text-sm" style="color:rgba(255,255,255,.7)">系统更新与重要通知</text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-3 pb-8">

      <!-- 加载骨架 -->
      <view v-if="loading" class="card p-4 flex items-center justify-center" style="height:120px">
        <van-loading type="spinner" color="var(--icon-primary)" size="24px" />
      </view>

      <!-- 无公告 -->
      <view v-else-if="!announcements.length" class="card p-6">
        <van-empty description="暂无公告" />
      </view>

      <!-- 公告列表 -->
      <view v-else v-for="item in announcements" :key="item.id" class="card p-4">

        <!-- 公告头部 -->
        <view class="flex items-center gap-2 mb-3">
          <view class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ background: getTagStyle(item.tag).color }"></view>
          <text class="flex-1 text-sm font-semibold text-[#1f2937]">{{ item.title }}</text>
          <view class="px-2 py-0.5 rounded-full"
                :style="{ background: getTagStyle(item.tag).bg }">
            <text class="text-xs font-medium"
                  :style="{ color: getTagStyle(item.tag).color }">
              {{ getTagStyle(item.tag).label }}
            </text>
          </view>
        </view>

        <!-- 内容 -->
        <text class="text-xs text-[#6b7280] leading-relaxed block">{{ item.content }}</text>

        <!-- 底部元信息 -->
        <view class="flex items-center justify-between mt-3 pt-3"
              style="border-top:1px solid #f3f4f6">
          <text class="text-xs text-[#9ca3af]">{{ formatDate(item.created_at) }}</text>
          <text class="text-xs text-[#9ca3af]">{{ item.author }}</text>
        </view>

      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      announcements: [],
      tagConfig: {
        NEW:  { label: 'NEW',  color: '#10b981', bg: '#d1fae5' },
        FIX:  { label: 'FIX',  color: '#f97316', bg: '#fff7ed' },
        INFO: { label: 'INFO', color: '#2563eb', bg: '#eff6ff' },
      },
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    getTagStyle(tag) {
      return this.tagConfig[tag] || { color: '#10b981', bg: '#d1fae5', label: tag }
    },
    loadData() {
      this.loading = true
      uni.request({
        url: '/api/announcement/list',
        method: 'GET',
        success: res => {
          this.announcements = res.data?.data || []
        },
        fail: () => {
          uni.showToast({ title: '加载失败', icon: 'none' })
        },
        complete: () => { this.loading = false },
      })
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return dateStr.slice(0, 10)
    },
  },
}
</script>

<style scoped></style>
