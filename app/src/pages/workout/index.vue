<template>
  <view class="page pb-24">

    <!-- 顶部渐变统计头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-xs block mb-4" style="color:rgba(255,255,255,.7)">本周运动概览</text>
      <view class="flex gap-4">
        <view v-for="stat in weekStats" :key="stat.label"
              class="flex-1 rounded-2xl p-3 text-center"
              style="background:rgba(255,255,255,.15)">
          <text class="text-white font-bold block" style="font-size:22px">{{ stat.value }}</text>
          <text class="text-xs block mt-1" style="color:rgba(255,255,255,.7)">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="px-4 -mt-8 flex flex-col gap-3 pb-4">

      <!-- 骨架屏 -->
      <view v-if="loading" class="flex flex-col gap-3">
        <view v-for="i in 3" :key="i" class="card p-4">
          <view class="flex items-center gap-3">
            <view class="w-10 h-10 rounded-xl bg-[#f3f4f6]"></view>
            <view class="flex-1">
              <view class="bg-[#f3f4f6] rounded-full mb-2" style="height:14px;width:40%"></view>
              <view class="bg-[#f3f4f6] rounded-full" style="height:12px;width:60%"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 记录卡片 -->
      <template v-else-if="list.length">
        <view
          v-for="item in list" :key="item.wid"
          class="card p-4"
          style="box-shadow:0 2px 8px rgba(0,0,0,.05)"
          @tap="goDetail(item.wid)"
        >
          <view class="flex items-center gap-3">
            <view class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  :style="{ background: typeConfig(item.type).bg }">
              <van-icon :name="typeConfig(item.type).icon"
                        size="20" :color="typeConfig(item.type).color" />
            </view>
            <view class="flex-1">
              <view class="flex items-center justify-between">
                <text class="text-sm font-semibold text-[#1f2937]">
                  {{ typeConfig(item.type).label }}
                </text>
                <text class="text-xs text-[#9ca3af]">{{ item.started_at }}</text>
              </view>
              <view class="flex items-center gap-3 mt-1">
                <text class="text-xs text-[#6b7280]">{{ item.duration }} 分钟</text>
                <text v-if="item.calories" class="text-xs text-[#6b7280]">
                  {{ item.calories }} kcal
                </text>
                <text v-if="item.detail && item.detail.distance"
                      class="text-xs text-[#6b7280]">
                  {{ item.detail.distance }} km
                </text>
              </view>
            </view>
            <van-icon name="arrow" size="14" color="var(--icon-secondary)" />
          </view>
        </view>
      </template>

      <!-- 空状态 -->
      <view v-else class="py-8">
        <van-empty description="还没有运动记录" image-size="100" />
        <view class="text-center mt-2">
          <text class="text-xs text-[#9ca3af]">点击右下角「+」添加第一条运动记录</text>
        </view>
      </view>

    </view>

    <!-- 悬浮添加按钮 -->
    <view
      class="flex items-center justify-center rounded-full"
      style="position:fixed;right:20px;bottom:80px;width:52px;height:52px;background:#10b981;box-shadow:0 4px 16px rgba(16,185,129,.4)"
      @tap="goAdd"
    >
      <van-icon name="plus" size="24" color="#fff" />
    </view>

  </view>
</template>

<script>
import { mapState } from 'vuex'

const TYPE_CONFIG = {
  running:  { label: '跑步', icon: 'todo-list-o', color: '#f97316', bg: '#fff7ed' },
  cycling:  { label: '骑行', icon: 'exchange',    color: '#3b82f6', bg: '#dbeafe' },
  gym:      { label: '健身', icon: 'fire-o',       color: '#10b981', bg: '#d1fae5' },
  swimming: { label: '游泳', icon: 'like-o',       color: '#06b6d4', bg: '#cffafe' },
  other:    { label: '其他', icon: 'setting-o',    color: '#6b7280', bg: '#f3f4f6' },
}

export default {
  data() {
    return {
      loading:   true,
      list:      [],
      statsData: null,
    }
  },
  computed: {
    ...mapState(['user']),
    weekStats() {
      const s = this.statsData || []
      const totalDuration = s.reduce((a, b) => a + Number(b.total_duration || 0), 0)
      const totalCalories = s.reduce((a, b) => a + Number(b.total_calories || 0), 0)
      const totalCount    = s.reduce((a, b) => a + Number(b.count         || 0), 0)
      return [
        { label: '总时长(min)', value: totalDuration || '—' },
        { label: '消耗(kcal)',  value: totalCalories || '—' },
        { label: '运动次数',    value: totalCount    || '—' },
      ]
    },
  },
  onShow() {
    this.loadData()
  },
  methods: {
    typeConfig(type) {
      return TYPE_CONFIG[type] || TYPE_CONFIG.other
    },
    loadData() {
      const token = this.user.token
      if (!token) { this.loading = false; return }
      this.loading = true
      Promise.all([
        new Promise(resolve => uni.request({
          url: '/api/workout/list?page=1&limit=30',
          method: 'GET',
          header: { token },
          success: res => resolve(res.data?.data?.list || []),
          fail:    () => resolve([]),
        })),
        new Promise(resolve => uni.request({
          url: '/api/workout/stats?range=week',
          method: 'GET',
          header: { token },
          success: res => resolve(res.data?.data || []),
          fail:    () => resolve([]),
        })),
      ]).then(([list, stats]) => {
        this.list      = list
        this.statsData = stats
        this.loading   = false
      })
    },
    goAdd()       { uni.navigateTo({ url: '/pages/workout/add' }) },
    goDetail(wid) { uni.navigateTo({ url: `/pages/workout/detail?wid=${wid}` }) },
  },
}
</script>

<style scoped></style>
