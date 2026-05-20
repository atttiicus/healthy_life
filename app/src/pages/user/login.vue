<template>
  <view class="min-h-screen bg-[#f0fdf4] flex flex-col">

    <!-- 顶部装饰 -->
    <view class="pt-16 pb-20 px-6"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:28px">欢迎回来 👋</text>
      <text class="text-sm block mt-2" style="color:rgba(255,255,255,.7)">
        登录您的健康生活账号
      </text>
    </view>

    <!-- 表单卡片 -->
    <view class="mx-4 -mt-10 bg-white rounded-3xl p-6 flex flex-col gap-4"
          style="box-shadow:0 8px 32px rgba(0,0,0,.1)">

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">账号</text>
        <view class="input-wrap">
          <text class="text-[#9ca3af] mr-2">👤</text>
          <input
            class="flex-1 text-sm text-[#1f2937] bg-transparent"
            v-model="loginAccount" type="number"
            placeholder="请输入手机号 / 账号"
            placeholder-style="color:#9ca3af"
          />
        </view>
      </view>

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">密码</text>
        <view class="input-wrap">
          <text class="text-[#9ca3af] mr-2">🔒</text>
          <input
            class="flex-1 text-sm text-[#1f2937] bg-transparent"
            v-model="loginPassword" password
            placeholder="请输入密码"
            placeholder-style="color:#9ca3af"
          />
        </view>
      </view>

      <view class="btn-green mt-2" @click="submitInfo">
        <text class="text-white font-semibold text-sm">登 录</text>
      </view>

      <view class="text-center" @click="goRegisterPage">
        <text class="text-sm text-[#6b7280]">还没有账号？</text>
        <text class="text-sm text-[#10b981] font-medium">立即注册</text>
      </view>

    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return { loginAccount: '', loginPassword: '' }
  },
  computed: { ...mapState(['user']) },
  methods: {
    ...mapActions(['userLogin']),
    async submitInfo() {
      if (!this.loginAccount || !this.loginPassword) return
      await this.userLogin({ _account: this.loginAccount, _password: this.loginPassword })
      if (this.user.uid) uni.switchTab({ url: '/pages/user/index' })
    },
    goRegisterPage() { uni.navigateTo({ url: './register' }) },
  },
}
</script>

<style scoped></style>
