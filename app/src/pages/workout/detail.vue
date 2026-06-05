<template>
  <view class="min-h-[calc(100vh-44px)] bg-[#f5f7fa] pb-8">

    <!-- 加载中 -->
    <view v-if="loading" class="flex items-center justify-center" style="height:100vh">
      <van-loading type="spinner" color="#10b981" size="36" />
    </view>

    <template v-else-if="workout">

      <!-- 渐变头部 -->
      <view class="px-5 pt-10 pb-14"
            style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
        <view class="flex items-center gap-3 mb-1">
          <view class="w-10 h-10 rounded-xl flex items-center justify-center"
                style="background:rgba(255,255,255,.2)">
            <van-icon :name="typeConf.icon" size="22" color="rgba(255,255,255,.9)" />
          </view>
          <view>
            <text class="text-white font-bold block" style="font-size:22px">
              {{ typeConf.label }}
            </text>
            <text class="text-sm" style="color:rgba(255,255,255,.7)">
              {{ workout.started_at }}
            </text>
          </view>
        </view>
      </view>

      <view class="px-4 -mt-6 flex flex-col gap-4">

        <!-- 核心数据卡 -->
        <view class="card p-4">
          <view class="grid grid-cols-3 gap-4 text-center">
            <view>
              <text class="text-xl font-bold text-[#1f2937] block">{{ workout.duration }}</text>
              <text class="text-xs text-[#9ca3af] block mt-0.5">分钟</text>
            </view>
            <view>
              <text class="text-xl font-bold text-[#1f2937] block">
                {{ workout.calories || '—' }}
              </text>
              <text class="text-xs text-[#9ca3af] block mt-0.5">kcal</text>
            </view>
            <view>
              <text class="text-xl font-bold text-[#1f2937] block">
                {{ workout.detail && workout.detail.distance ? workout.detail.distance : '—' }}
              </text>
              <text class="text-xs text-[#9ca3af] block mt-0.5">km</text>
            </view>
          </view>
        </view>

        <!-- 扩展数据（跑步/骑行） -->
        <view v-if="workout.detail && (workout.detail.avg_pace || workout.detail.avg_heart_rate)"
              class="card overflow-hidden">
          <view class="px-4 pt-4 pb-2">
            <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">详细数据</text>
          </view>
          <view v-if="workout.detail.avg_pace" class="detail-row">
            <van-icon name="orders-o" size="16" color="var(--icon-primary)" />
            <text class="detail-label">平均配速</text>
            <text class="detail-value">{{ workout.detail.avg_pace }} min/km</text>
          </view>
          <view v-if="workout.detail.avg_heart_rate" class="detail-row">
            <van-icon name="like-o" size="16" color="var(--icon-primary)" />
            <text class="detail-label">平均心率</text>
            <text class="detail-value">{{ workout.detail.avg_heart_rate }} bpm</text>
          </view>
        </view>

        <!-- 备注 -->
        <view v-if="workout.notes" class="card p-4">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
            备注
          </text>
          <text class="text-sm text-[#374151] leading-relaxed">{{ workout.notes }}</text>
        </view>

        <!-- 删除按钮 -->
        <view
          class="h-12 rounded-xl flex items-center justify-center gap-2 mt-2"
          style="background:#fee2e2;border:1px solid #fca5a5"
          @tap="showDeleteDialog = true"
        >
          <van-icon name="delete-o" size="16" color="#ef4444" />
          <text style="color:#ef4444;font-size:14px;font-weight:600">删除记录</text>
        </view>

      </view>

    </template>

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model="showDeleteDialog"
      title="删除运动记录"
      message="确认删除这条运动记录？删除后将同步更新当天运动数据。"
      show-cancel-button
      confirm-button-color="#ef4444"
      @confirm="onDelete"
    />

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
      loading:          true,
      workout:          null,
      wid:              null,
      showDeleteDialog: false,
    }
  },
  computed: {
    ...mapState(['user']),
    typeConf() {
      return TYPE_CONFIG[this.workout?.type] || TYPE_CONFIG.other
    },
  },
  onLoad(query) {
    this.wid = Number(query.wid)
    this.loadDetail()
  },
  methods: {
    loadDetail() {
      uni.request({
        url:    `/api/workout/${this.wid}`,
        method: 'GET',
        header: { token: this.user.token },
        success: (res) => {
          if (res.data?.code === 20000) {
            this.workout = res.data.data
          } else {
            uni.showToast({ title: '记录不存在', icon: 'none', duration: 2000 })
            setTimeout(() => uni.navigateBack(), 2000)
          }
          this.loading = false
        },
        fail: () => {
          uni.showToast({ title: '加载失败', icon: 'none', duration: 2000 })
          this.loading = false
        },
      })
    },
    onDelete() {
      uni.request({
        url:    `/api/workout/${this.wid}`,
        method: 'DELETE',
        header: { token: this.user.token },
        success: (res) => {
          if (res.data?.code === 20000) {
            uni.showToast({ title: '已删除', icon: 'none', duration: 1500 })
            setTimeout(() => uni.navigateBack(), 1500)
          } else {
            uni.showToast({ title: res.data?.message || '删除失败', icon: 'none', duration: 2000 })
          }
        },
        fail: () => uni.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 }),
      })
    },
  },
}
</script>

<style scoped>
.detail-row {
  display: flex; align-items: center;
  padding: 12px 16px; gap: 10px;
  border-bottom: 1px solid #f3f4f6;
}
.detail-label {
  font-size: 14px; color: #374151; font-weight: 500; flex: 1;
}
.detail-value {
  font-size: 14px; color: #1f2937; font-weight: 600;
}
</style>
