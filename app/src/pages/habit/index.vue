<template>
  <view class="min-h-screen bg-[#f5f7fa] pb-24">

    <!-- 渐变头 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">习惯养成</text>
      <view class="flex gap-6 mt-3">
        <view class="text-center">
          <text class="text-white font-bold block" style="font-size:24px">{{ habits.length }}</text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">进行中</text>
        </view>
        <view class="text-center">
          <text class="text-white font-bold block" style="font-size:24px">{{ todayDoneCount }}</text>
          <text class="text-xs block mt-0.5" style="color:rgba(255,255,255,.7)">今日已完成</text>
        </view>
      </view>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-3">

      <!-- 加载骨架 -->
      <view v-if="loading" class="flex flex-col gap-3">
        <view v-for="i in 2" :key="i" class="card p-4">
          <view class="flex items-center gap-3">
            <view class="w-12 h-12 rounded-2xl bg-[#f3f4f6]"></view>
            <view class="flex-1">
              <view class="bg-[#f3f4f6] rounded-full mb-2" style="height:14px;width:50%"></view>
              <view class="bg-[#f3f4f6] rounded-full" style="height:12px;width:70%"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!habits.length" class="card p-6 mt-2">
        <van-empty description="还没有习惯，点击右下角「+」开始" image-size="100" />
      </view>

      <!-- 习惯卡片 -->
      <view
        v-else
        v-for="item in habits" :key="item.hid"
        class="card p-4"
        style="box-shadow:0 2px 8px rgba(0,0,0,.05)"
      >
        <view class="flex items-center gap-3">

          <!-- 图标 -->
          <view class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                :style="{ background: item.checked_today ? '#ecfdf5' : '#f3f4f6' }">
            <van-icon
              :name="item.icon || 'star-o'"
              size="24"
              :color="item.checked_today ? 'var(--icon-primary)' : 'var(--icon-secondary)'"
            />
          </view>

          <!-- 主体 -->
          <view class="flex-1 min-w-0">
            <view class="flex items-center justify-between">
              <text class="text-sm font-semibold text-[#1f2937]">{{ item.title }}</text>
              <!-- 删除按钮 -->
              <van-icon
                name="delete-o"
                size="16"
                color="var(--icon-secondary)"
                @tap.stop="confirmDelete(item)"
              />
            </view>
            <!-- 进度条 -->
            <view class="mt-2 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
              <view
                class="h-1.5 rounded-full"
                style="background:#10b981;transition:width .3s"
                :style="{ width: getProgressPct(item.total_days, item.target_days) }"
              ></view>
            </view>
            <text class="text-xs text-[#9ca3af] block mt-1">
              已坚持 {{ item.total_days }} 天 / 目标 {{ item.target_days }} 天
            </text>
          </view>

          <!-- 打卡按钮 -->
          <view
            class="ml-2 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ background: item.checked_today ? '#ecfdf5' : '#10b981' }"
            @tap="handleTodayCheck(item)"
          >
            <van-icon
              :name="item.checked_today ? 'success' : 'plus'"
              size="18"
              :color="item.checked_today ? 'var(--icon-primary)' : '#fff'"
            />
          </view>

        </view>
      </view>

    </view>

    <!-- 浮动添加按钮 -->
    <view
      class="fixed flex items-center justify-center"
      style="right:20px;bottom:90px;width:52px;height:52px;border-radius:26px;background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 16px rgba(16,185,129,.4)"
      @tap="openAdd"
    >
      <van-icon name="plus" size="24" color="#fff" />
    </view>

    <!-- 添加习惯弹窗 -->
    <van-popup
      v-model="showAdd"
      position="bottom"
      :style="{ borderRadius: '20px 20px 0 0', padding: '24px 16px 40px' }"
    >
      <text class="text-base font-semibold text-[#1f2937] block mb-4">新建习惯</text>

      <!-- 习惯名称 -->
      <view class="input-wrap mb-3">
        <input
          class="flex-1 text-sm text-[#1f2937] bg-transparent"
          v-model="form.title"
          placeholder="习惯名称，如：每天喝 8 杯水"
          placeholder-style="color:#9ca3af"
          :maxlength="30"
        />
      </view>

      <!-- 图标选择 -->
      <text class="text-xs text-[#9ca3af] block mb-2">选择图标</text>
      <view class="flex flex-wrap gap-2 mb-4">
        <view
          v-for="opt in iconOptions" :key="opt.icon"
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :style="{ background: form.icon === opt.icon ? '#ecfdf5' : '#f3f4f6',
                    border: form.icon === opt.icon ? '2px solid #10b981' : '2px solid transparent' }"
          @tap="form.icon = opt.icon"
        >
          <van-icon :name="opt.icon" size="20"
                    :color="form.icon === opt.icon ? 'var(--icon-primary)' : 'var(--icon-secondary)'" />
        </view>
      </view>

      <!-- 目标天数 -->
      <text class="text-xs text-[#9ca3af] block mb-2">目标天数</text>
      <view class="flex gap-2 mb-5">
        <view
          v-for="d in [21, 30, 66]" :key="d"
          class="flex-1 py-2 rounded-xl text-center text-sm"
          :style="{ background: form.target_days === d ? '#10b981' : '#f3f4f6',
                    color: form.target_days === d ? '#fff' : '#6b7280',
                    fontWeight: form.target_days === d ? '600' : '400' }"
          @tap="form.target_days = d"
        >{{ d }} 天</view>
      </view>

      <!-- 确认按钮 -->
      <view
        class="h-11 rounded-xl flex items-center justify-center"
        style="background:linear-gradient(135deg,#10b981,#059669)"
        @tap="submitAdd"
      >
        <text class="text-white font-semibold text-sm">创建习惯</text>
      </view>
    </van-popup>

    <!-- 删除确认 -->
    <van-dialog
      v-model="showDeleteDialog"
      title="删除习惯"
      :message="'确认删除「' + (deleteTarget ? deleteTarget.title : '') + '」？删除后记录将无法恢复。'"
      show-cancel-button
      confirm-button-color="#dc2626"
      @confirm="doDelete"
    />

  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      habits: [],
      showAdd: false,
      showDeleteDialog: false,
      deleteTarget: null,
      form: { title: '', icon: 'star-o', target_days: 21 },
      iconOptions: [
        { icon: 'star-o' },
        { icon: 'fire-o' },
        { icon: 'water-o' },
        { icon: 'clock-o' },
        { icon: 'music-o' },
        { icon: 'smile-o' },
        { icon: 'bookmark-o' },
        { icon: 'phone-o' },
        { icon: 'leaf' },
        { icon: 'gem-o' },
      ],
    }
  },
  computed: {
    ...mapState(['user']),
    todayDoneCount() {
      return this.habits.filter(habit => habit.checked_today).length
    },
  },
  onShow() {
    this.loadData()
  },
  methods: {
    // 统一请求封装，消除重复的 code 判断 + toast 逻辑
    _habitRequest({ url, method = 'POST', data, successMsg, errorMsg, onSuccess, onComplete }) {
      const header = { token: this.user.token }
      if (data) header['content-type'] = 'application/json'
      uni.request({
        url,
        method,
        header,
        data,
        success: res => {
          if (res.data?.code === 20000) {
            if (successMsg) uni.showToast({ title: successMsg, icon: 'none', duration: 1200 })
            onSuccess && onSuccess()
          } else {
            uni.showToast({ title: res.data?.message || errorMsg || '操作失败', icon: 'none' })
          }
        },
        fail: () => uni.showToast({ title: '网络错误', icon: 'none' }),
        complete: onComplete,
      })
    },

    loadData() {
      const token = this.user.token
      if (!token) return
      this.loading = true
      uni.request({
        url: '/api/habit/list',
        method: 'GET',
        header: { token },
        success: res => { this.habits = res.data?.data || [] },
        fail: () => uni.showToast({ title: '加载失败', icon: 'none' }),
        complete: () => { this.loading = false },
      })
    },

    getProgressPct(totalDays, targetDays) {
      if (!targetDays) return '0%'
      return Math.min(100, Math.round(totalDays / targetDays * 100)) + '%'
    },

    handleTodayCheck(item) {
      if (item.checked_today) return
      this._habitRequest({
        url: `/api/habit/${item.hid}/check`,
        successMsg: '打卡成功',
        errorMsg: '打卡失败',
        onSuccess: () => {
          item.checked_today = true
          item.total_days++
        },
      })
    },

    openAdd() {
      this.form = { title: '', icon: 'star-o', target_days: 21 }
      this.showAdd = true
    },

    submitAdd() {
      const title = this.form.title.trim()
      if (!title) { uni.showToast({ title: '请输入习惯名称', icon: 'none' }); return }
      this._habitRequest({
        url: '/api/habit/create',
        data: { title, icon: this.form.icon, target_days: this.form.target_days },
        successMsg: '创建成功',
        errorMsg: '创建失败',
        onSuccess: () => { this.showAdd = false; this.loadData() },
      })
    },

    confirmDelete(item) {
      this.deleteTarget = item
      this.showDeleteDialog = true
    },

    doDelete() {
      if (!this.deleteTarget) return
      this._habitRequest({
        url: `/api/habit/${this.deleteTarget.hid}`,
        method: 'DELETE',
        successMsg: '已删除',
        errorMsg: '删除失败',
        onSuccess: () => this.loadData(),
        onComplete: () => { this.deleteTarget = null },
      })
    },
  },
}
</script>

<style scoped></style>
