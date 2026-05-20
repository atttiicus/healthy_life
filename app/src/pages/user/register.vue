<template>
  <view class="min-h-screen bg-[#f0fdf4]">

    <!-- 顶部装饰 -->
    <view class="pt-16 pb-20 px-6"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:28px">创建账号 ✨</text>
      <text class="text-sm block mt-2" style="color:rgba(255,255,255,.7)">
        加入健康生活，开始您的健康旅程
      </text>
    </view>

    <!-- 表单卡片 -->
    <view class="mx-4 -mt-10 bg-white rounded-3xl p-6 flex flex-col gap-4"
          style="box-shadow:0 8px 32px rgba(0,0,0,.1)">

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">手机号 *</text>
        <view class="input-wrap">
          <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                 v-model="user_info.account" type="number"
                 placeholder="请输入手机号" placeholder-style="color:#9ca3af" />
        </view>
      </view>

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">密码 *</text>
        <view class="input-wrap">
          <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                 v-model="user_info.password" password
                 placeholder="请设置密码" placeholder-style="color:#9ca3af" />
        </view>
      </view>

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">昵称 *</text>
        <view class="input-wrap">
          <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                 v-model="user_info.username"
                 placeholder="请输入昵称" placeholder-style="color:#9ca3af" />
        </view>
      </view>

      <view class="flex gap-3">
        <view class="flex-1">
          <text class="text-sm font-medium text-[#374151] block mb-1">年龄</text>
          <view class="input-wrap">
            <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                   v-model="user_info.age" type="number"
                   placeholder="年龄" placeholder-style="color:#9ca3af" />
          </view>
        </view>
        <view class="flex-1">
          <text class="text-sm font-medium text-[#374151] block mb-1">性别</text>
          <view class="input-wrap">
            <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                   v-model="user_info.sex"
                   placeholder="男 / 女" placeholder-style="color:#9ca3af" />
          </view>
        </view>
      </view>

      <view>
        <text class="text-sm font-medium text-[#374151] block mb-1">邮箱（选填）</text>
        <view class="input-wrap">
          <input class="flex-1 text-sm text-[#1f2937] bg-transparent"
                 v-model="user_info.email"
                 placeholder="请输入邮箱" placeholder-style="color:#9ca3af" />
        </view>
      </view>

      <view class="btn-green mt-2" @click="register">
        <text class="text-white font-semibold text-sm">注 册</text>
      </view>

      <view class="text-center" @tap="() => uni.navigateBack()">
        <text class="text-sm text-[#6b7280]">已有账号？</text>
        <text class="text-sm text-[#10b981] font-medium">返回登录</text>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user_info: { username: '', account: '', password: '', age: null, sex: '', email: '' },
    }
  },
  methods: {
    register() {
      if (!this.verifyInfo()) {
        uni.showModal({ title: '提示', content: '注册参数有误', showCancel: false }); return
      }
      uni.request({
        method: 'POST', url: '/api/user/register',
        data: {
          account: this.user_info.account,
          user_name: this.user_info.username,
          password: this.user_info.password,
          sex: this.user_info.sex,
          age: this.user_info.age,
          email: this.user_info.email,
        },
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          if (res.data) {
            uni.showModal({
              title: '注册成功', content: '点击确认跳转至登录页面', showCancel: false,
              success: (r) => { if (r.confirm) uni.navigateTo({ url: './login' }) },
            })
          } else {
            uni.showModal({ title: '注册失败', content: '请重试', showCancel: false })
          }
        },
      })
    },
    verifyInfo() {
      const u = this.user_info
      if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(u.account)) return false
      if (!u.password || !u.username) return false
      if (!/^[男女]{1}$/.test(u.sex)) return false
      return true
    },
  },
}
</script>

<style scoped></style>
