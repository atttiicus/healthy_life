<template>
  <view class="min-h-screen bg-[#f5f7fa]">

    <!-- 顶部渐变头 -->
    <view class="px-5 pt-10 pb-14"
          style="background:linear-gradient(135deg,#10b981 0%,#059669 100%)">
      <text class="text-white font-bold block" style="font-size:22px">编辑资料</text>
      <text class="text-sm block mt-1" style="color:rgba(255,255,255,.7)">
        修改您的账户信息和个人数据
      </text>
    </view>

    <view class="px-4 -mt-8 flex flex-col gap-4 pb-8">

      <!-- 账户信息卡 -->
      <view class="card overflow-hidden" style="box-shadow:0 4px 16px rgba(0,0,0,.08)">
        <view class="px-4 pt-4 pb-2">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">账户信息</text>
        </view>

        <view class="field-row" @tap="focusInput('username')">
          <view class="field-icon-wrap">
            <text>👤</text>
          </view>
          <view class="field-body">
            <text class="field-label">用户名</text>
            <input
              ref="username"
              class="field-input"
              v-model="form.username"
              placeholder="请输入用户名"
              placeholder-style="color:#c4c9d4"
            />
          </view>
        </view>
        <view class="divider-line" />

        <view class="field-row" @tap="focusInput('oldPassword')">
          <view class="field-icon-wrap">
            <text>🔒</text>
          </view>
          <view class="field-body">
            <text class="field-label">原密码</text>
            <input
              ref="oldPassword"
              class="field-input"
              v-model="form.old_password"
              password
              placeholder="请输入原密码"
              placeholder-style="color:#c4c9d4"
            />
          </view>
        </view>
        <view class="divider-line" />

        <view class="field-row" @tap="focusInput('newPassword')">
          <view class="field-icon-wrap">
            <text>✏️</text>
          </view>
          <view class="field-body">
            <text class="field-label">新密码</text>
            <input
              ref="newPassword"
              class="field-input"
              v-model="form.new_password"
              password
              placeholder="不修改请留空"
              placeholder-style="color:#c4c9d4"
            />
          </view>
        </view>
        <view class="divider-line" />

        <!-- 头像上传 -->
        <view class="field-row" @tap="uploadUserImage">
          <view class="field-icon-wrap">
            <text>📷</text>
          </view>
          <view class="field-body">
            <text class="field-label">头像</text>
            <view class="avatar-picker">
              <image
                v-if="form.newImage"
                :src="form.newImage"
                class="avatar-img"
                mode="aspectFill"
              />
              <view v-else class="avatar-placeholder">
                <text style="color:#9ca3af;font-size:11px">点击上传</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 个人信息卡 -->
      <view class="card overflow-hidden">
        <view class="px-4 pt-4 pb-2">
          <text class="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">个人信息</text>
        </view>

        <view
          v-for="item in personalFields"
          :key="item.key"
        >
          <view class="field-row" @tap="focusInput(item.key)">
            <view class="field-icon-wrap">
              <text>{{ item.icon }}</text>
            </view>
            <view class="field-body">
              <text class="field-label">{{ item.label }}</text>
              <view class="flex items-center gap-2 flex-1">
                <input
                  :ref="item.key"
                  class="field-input flex-1"
                  v-model="form[item.key]"
                  :type="item.type || 'text'"
                  :placeholder="item.placeholder"
                  placeholder-style="color:#c4c9d4"
                />
                <text v-if="item.unit" class="field-unit">{{ item.unit }}</text>
              </view>
            </view>
          </view>
          <view class="divider-line" />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view
        class="h-12 rounded-xl flex items-center justify-center"
        style="background:linear-gradient(135deg,#10b981,#059669)"
        @tap="onSubmit"
      >
        <text class="text-white font-semibold text-sm">保存修改</text>
      </view>

    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      queryID: 'username',
      form: {
        username:     '',
        old_password: '',
        new_password: '',
        sex:          '',
        age:          '',
        weight:       '',
        height:       '',
        cholesterol:  '',
        heartRate:    '',
        newImage:     '',
      },
    }
  },
  computed: {
    ...mapState(['user']),
    personalFields() {
      return [
        { key: 'sex',         icon: '⚧',  label: '性别', placeholder: '男 / 女'         },
        { key: 'age',         icon: '🎂',  label: '年龄', placeholder: '请输入年龄',  type: 'number', unit: '岁'  },
        { key: 'weight',      icon: '⚖️',  label: '体重', placeholder: '请输入体重',  type: 'number', unit: 'kg'  },
        { key: 'height',      icon: '📏',  label: '身高', placeholder: '请输入身高',  type: 'number', unit: 'cm'  },
        { key: 'cholesterol', icon: '💉',  label: '血压', placeholder: '如 120/80'                                },
        { key: 'heartRate',   icon: '❤️',  label: '心率', placeholder: '请输入心率',  type: 'number', unit: 'bpm' },
      ]
    },
  },
  onLoad(query) {
    this.queryID = query.id || 'username'
    // 预填用户现有数据
    if (this.user) {
      this.form.username = this.user.user_name || ''
      this.form.sex      = this.user.sex       || ''
      this.form.age      = this.user.age       || ''
      this.form.weight   = this.user.weight    || ''
      this.form.height   = this.user.height    || ''
    }
  },
  mounted() {
    // 自动聚焦到指定字段
    this.$nextTick(() => {
      const ref = this.$refs[this.queryID]
      if (ref) {
        const el = Array.isArray(ref) ? ref[0] : ref
        el && el.$el ? el.$el.focus() : el && el.focus && el.focus()
      }
    })
  },
  methods: {
    ...mapMutations(['setUser']),
    focusInput(key) {
      const ref = this.$refs[key]
      if (!ref) return
      const el = Array.isArray(ref) ? ref[0] : ref
      el && el.$el ? el.$el.focus() : el && el.focus && el.focus()
    },
    uploadUserImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          uni.uploadFile({
            url: '/api/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: (result) => {
              this.form.newImage = JSON.parse(result.data).data.path
              uni.showToast({ title: '上传成功', icon: 'success' })
            },
            fail: () => {
              uni.showToast({ title: '上传失败', icon: 'error' })
            },
          })
        },
      })
    },
    onSubmit() {
      if (!this.form.username) {
        uni.showToast({ title: '用户名不能为空', icon: 'error' }); return
      }
      const data = {
        user_name: this.form.username,
        sex:       this.form.sex,
        age:       this.form.age,
        weight:    this.form.weight,
        height:    this.form.height,
      }
      if (this.form.new_password) data.password = this.form.new_password
      if (this.form.newImage)     data.avatar   = this.form.newImage

      uni.request({
        method: 'POST',
        url: '/api/user/update',
        data,
        header: { token: this.user.token, 'Content-Type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          if (res.data.data) {
            uni.showToast({ title: '修改成功', icon: 'success' })
            setTimeout(() => uni.navigateBack(), 800)
          } else {
            uni.showToast({ title: res.data.message || '修改失败', icon: 'error' })
          }
        },
      })
    },
  },
}
</script>

<style scoped>
.field-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
}
.field-icon-wrap {
  width: 34px;
  height: 34px;
  background: #f0fdf4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.field-body {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}
.field-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  width: 48px;
  flex-shrink: 0;
}
.field-input {
  flex: 1;
  font-size: 14px;
  color: #111827;
  background: transparent;
  border: none;
  outline: none;
  text-align: right;
}
.field-unit {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}
.divider-line {
  height: 1px;
  background: #f3f4f6;
  margin-left: 62px;
}
.avatar-picker {
  margin-left: auto;
}
.avatar-img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 1.5px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
