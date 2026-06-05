<template>
  <view class="page pb-6">

    <!-- 顶部个人信息卡 -->
    <view class="px-5 pt-10 pb-16"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <view class="flex items-center gap-4">
        <view class="rounded-2xl overflow-hidden border-2 flex-shrink-0"
              style="width:64px;height:64px;border-color:rgba(255,255,255,.4)"
              @tap="userCoverHandle">
          <image src="/static/user_def.png" mode="aspectFill"
                 style="width:64px;height:64px" />
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
            <text>{{ item.icon }}</text>
          </view>
          <text class="flex-1 text-sm font-medium text-[#374151]">{{ item.title }}</text>
          <text class="text-[#d1d5db] text-lg">›</text>
        </view>
      </view>

    </view>

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
        { title: '公告',     icon: '📢', bg: '#fef3c7', onTap: null },
        { title: '管理设置', icon: '⚙️', bg: '#ede9fe', onTap: null },
        { title: '关于我们', icon: 'ℹ️', bg: '#dbeafe', onTap: null },
        { title: '退出账号', icon: '🚪', bg: '#fee2e2', onTap: this.logout },
      ]
    },
  },
  data() { return {} },
  onLoad() {
    if (!this.user.uid) uni.navigateTo({ url: './login' })
  },
  methods: {
    ...mapMutations(['setUser']),
    logout() {
      uni.showModal({
        title: '是否退出当前账户',
        success: (res) => {
          if (res.confirm) {
            this.setUser({})
            uni.setStorageSync('user_data', {})
          }
        },
      })
    },
    userCoverHandle() {
      if (!this.user.uid) { uni.navigateTo({ url: './login' }); return }
    },
    userDataHandle(id = 'iWeight') {
      if (!this.user.uid) { uni.navigateTo({ url: './login' }); return }
      uni.navigateTo({ url: './update?id=' + id })
    },
  },
}
</script>

<style scoped></style>
