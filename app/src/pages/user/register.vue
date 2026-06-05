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
          <view class="flex gap-2" style="padding: 8px 12px; background:#f9fafb; border-radius:12px;">
            <text
              v-for="opt in ['男', '女']" :key="opt"
              class="flex-1 text-center text-sm font-medium"
              style="padding: 6px 0; border-radius: 8px; transition: all .2s;"
              :style="user_info.sex === opt
                ? 'background:#10b981;color:#fff;'
                : 'color:#9ca3af;'"
              @tap="user_info.sex = opt"
            >{{ opt }}</text>
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
      const errMsg = this.verifyInfo()
      if (errMsg) {
        uni.showToast({ title: errMsg, icon: 'none', duration: 2500 }); return
      }
      uni.request({
        method: 'POST', url: '/api/user/register',
        data: {
          account:   this.user_info.account,
          user_name: this.user_info.username,
          password:  this.user_info.password,
          sex:       this.user_info.sex,
          age:       this.user_info.age,
          email:     this.user_info.email,
        },
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          if (res.data && res.data.code === 20000) {
            uni.showModal({
              title: '注册成功', content: '点击确认前往登录', showCancel: false,
              success: (r) => { if (r.confirm) uni.navigateTo({ url: './login' }) },
            })
          } else {
            uni.showToast({ title: res.data?.message || '注册失败，请重试', icon: 'none', duration: 2500 })
          }
        },
      })
    },
    verifyInfo() {
      const u = this.user_info
      if (!u.account)                                    return '请填写手机号'
      if (!/^1\d{10}$/.test(u.account))                 return '手机号格式不正确，需为11位手机号'
      if (!u.password)                                   return '请设置密码'
      if (u.password.length < 6)                        return '密码至少需要6位'
      if (!u.username)                                   return '请填写昵称'
      if (u.username.trim().length < 2)                 return '昵称至少需要2个字符'
      if (!u.sex)                                        return '请选择性别'
      if (u.age && (Number(u.age) < 1 || Number(u.age) > 120)) return '年龄应在 1 ~ 120 之间'
      if (u.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)) return '邮箱格式不正确'
      return null
    },
  },
}
</script>

<style scoped></style>
