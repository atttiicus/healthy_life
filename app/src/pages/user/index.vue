<template>
  <view class="page pb-6">

    <!-- 顶部个人信息卡 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <view class="flex items-center gap-4">
        <view class="rounded-2xl flex-shrink-0 flex items-center justify-center"
              style="width:64px;height:64px;background:rgba(255,255,255,.2);border:2px solid rgba(255,255,255,.4)"
              @tap="userCoverHandle">
          <image v-if="user.avatar"
                 :src="user.avatar" mode="aspectFill"
                 class="rounded-2xl"
                 style="width:64px;height:64px" />
          <van-icon v-else name="manager-o" size="32" color="rgba(255,255,255,.9)" />
        </view>
        <view class="flex-1">
          <text class="text-white text-xl font-bold block">
            {{ user.user_name || '未登录' }}
          </text>
          <view class="flex items-center gap-3 mt-1">
            <text class="text-sm" style="color:rgba(255,255,255,.7)">
              {{ user.age || '--' }} 岁
            </text>
            <text style="color:rgba(255,255,255,.4)">|</text>
            <text class="text-sm" style="color:rgba(255,255,255,.7)">
              {{ user.sex || '--' }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4">

      <!-- 指标悬浮卡 -->
      <view class="card p-4" style="box-shadow:0 4px 16px rgba(0,0,0,.08)">
        <view class="grid grid-cols-4 gap-2">
          <view
            v-for="stat in statsItems" :key="stat.title"
            class="text-center py-2"
            @tap.stop="userDataHandle(stat.id)"
          >
            <text class="text-xl font-bold text-[#1f2937] block">{{ stat.value }}</text>
            <text class="text-xs text-[#9ca3af] block mt-0.5">{{ stat.unit }}</text>
            <text class="text-xs text-[#6b7280] block mt-1">{{ stat.title }}</text>
          </view>
        </view>
      </view>

      <!-- 设置列表 -->
      <view class="card overflow-hidden">
        <view
          v-for="(item, idx) in settingItems" :key="item.title"
          class="flex items-center px-4 py-4"
          :class="idx < settingItems.length - 1 ? 'border-b border-[#f3f4f6]' : ''"
          @tap.stop="item.onTap && item.onTap()"
        >
          <view class="w-8 h-8 rounded-xl flex items-center justify-center mr-3"
                :style="{ background: item.bg }">
            <van-icon :name="item.icon" size="18" :color="item.iconColor || 'var(--icon-secondary)'" />
          </view>
          <text class="flex-1 text-sm font-medium text-[#374151]">{{ item.title }}</text>
          <text class="text-[#d1d5db] text-lg">›</text>
        </view>
      </view>

    </view>

    <van-dialog
      v-model="showLogoutDialog"
      title="退出账号"
      message="确认退出当前账户？"
      show-cancel-button
      confirm-button-color="#10b981"
      @confirm="doLogout"
    />

  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['user', 'userPlanData']),
    statsItems() {
      return [
        { id: 'iWeight',      title: '体重', value: this.user.weight                   || '--', unit: 'KG'   },
        { id: 'iHeight',      title: '身高', value: this.user.height                   || '--', unit: 'cm'   },
        { id: 'iCholesterol', title: '血压', value: this.userPlanData.bloodPressure    || '--', unit: 'mmHg' },
        { id: 'iHeartRate',   title: '心率', value: this.userPlanData.heartRate        || '--', unit: 'Bpm'  },
      ]
    },
    settingItems() {
      return [
        { title: '公告',     icon: 'bullhorn-o', iconColor: 'var(--icon-amber)',  bg: '#fef3c7', onTap: () => uni.navigateTo({ url: '/pages/user/announcement' }) },
        { title: '管理设置', icon: 'setting-o',  iconColor: 'var(--icon-purple)', bg: '#ede9fe', onTap: () => uni.navigateTo({ url: '/pages/user/settings' }) },
        { title: '关于我们', icon: 'info-o',     iconColor: 'var(--icon-info)',   bg: '#dbeafe', onTap: () => uni.navigateTo({ url: '/pages/user/about' }) },
        { title: '退出账号', icon: 'cross',      iconColor: 'var(--icon-danger)', bg: '#fee2e2', onTap: this.logout },
      ]
    },
  },
  data() { return { showLogoutDialog: false } },
  onLoad() {
    if (!this.user.uid) uni.navigateTo({ url: '/pages/user/login' })
  },
  methods: {
    ...mapMutations(['setUser']),
    logout() {
      this.showLogoutDialog = true
    },
    doLogout() {
      this.setUser({})
      uni.setStorageSync('user_data', {})
    },
    userCoverHandle() {
      if (!this.user.uid) { uni.navigateTo({ url: '/pages/user/login' }); return }
    },
    userDataHandle(id = 'iWeight') {
      if (!this.user.uid) { uni.navigateTo({ url: '/pages/user/login' }); return }
      uni.navigateTo({ url: '/pages/user/update?id=' + id })
    },
  },
}
</script>

<style scoped></style>
