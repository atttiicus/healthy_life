<template>
  <div class="page">

    <!-- 左侧品牌区 -->
    <div class="brand">
      <div class="brand-inner">
        <div class="logo">🌿</div>
        <h1 class="brand-title">健康生活</h1>
        <p class="brand-sub">管理中台</p>
        <p class="brand-desc">统一管理用户、文章与健康数据</p>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="form-area">
      <div class="form-card">

        <!-- Tab -->
        <div class="tab-bar">
          <button
            :class="['tab', mode === 'login' && 'tab-active']"
            @click="mode = 'login'"
          >登录</button>
          <button
            :class="['tab', mode === 'register' && 'tab-active']"
            @click="mode = 'register'"
          >注册</button>
        </div>

        <!-- 登录表单 -->
        <el-form
          v-if="mode === 'login'"
          :model="loginForm"
          :rules="loginRules"
          ref="loginRef"
          label-position="top"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="loginForm.account"
              placeholder="请输入管理员账号"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-button
            class="submit-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >登 录</el-button>
        </el-form>

        <!-- 注册表单 -->
        <el-form
          v-else
          :model="registerForm"
          :rules="registerRules"
          ref="registerRef"
          label-position="top"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="registerForm.account"
              placeholder="设置管理员账号"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="设置登录密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input
              v-model="registerForm.confirm"
              type="password"
              placeholder="再次输入密码"
              size="large"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleRegister"
            />
          </el-form-item>
          <el-button
            class="submit-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="handleRegister"
          >注 册</el-button>
        </el-form>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { adminLogin, adminRegister } from '../api'
import { useAuthStore } from '../stores/auth'
import type { AdminInfo } from '../types'

const router    = useRouter()
const authStore = useAuthStore()
const loading   = ref(false)
const mode      = ref<'login' | 'register'>('login')

// ─── 登录 ────────────────────────────────────────────────────────────────────
const loginRef  = ref<FormInstance>()
const loginForm = reactive({ account: '', password: '' })
const loginRules: FormRules = {
  account:  [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!loginRef.value) return
  await loginRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const data = (await adminLogin(loginForm)) as AdminInfo
      authStore.setAuth(data)
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } finally {
      loading.value = false
    }
  })
}

// ─── 注册 ────────────────────────────────────────────────────────────────────
const registerRef  = ref<FormInstance>()
const registerForm = reactive({ account: '', password: '', confirm: '' })
const registerRules: FormRules = {
  account:  [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirm: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.password) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

const handleRegister = async () => {
  if (!registerRef.value) return
  await registerRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await adminRegister({ account: registerForm.account, password: registerForm.password })
      ElMessage.success('注册成功，请登录')
      mode.value = 'login'
      loginForm.account = registerForm.account
      loginForm.password = ''
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  background: #f5f7fa;
}

/* 左侧品牌 */
.brand {
  width: 420px;
  flex-shrink: 0;
  background: linear-gradient(150deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-inner {
  text-align: center;
  color: #fff;
  padding: 0 40px;
}
.logo {
  font-size: 64px;
  margin-bottom: 16px;
}
.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 4px;
}
.brand-sub {
  font-size: 16px;
  opacity: .8;
  margin: 0 0 24px;
}
.brand-desc {
  font-size: 14px;
  opacity: .65;
  line-height: 1.7;
  margin: 0;
}

/* 右侧表单 */
.form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-card {
  width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .08);
}

/* Tab */
.tab-bar {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}
.tab {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all .2s;
}
.tab-active {
  background: #fff;
  color: #10b981;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  margin-top: 8px;
  background: #10b981 !important;
  border-color: #10b981 !important;
}
.submit-btn:hover {
  background: #059669 !important;
  border-color: #059669 !important;
}

/* 响应式：小屏幕隐藏左侧品牌 */
@media (max-width: 768px) {
  .brand { display: none; }
}
</style>
