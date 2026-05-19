import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AdminInfo } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('admin_token') || '')
  const adminInfo = ref<AdminInfo | null>(null)

  const setAuth = (info: AdminInfo) => {
    adminInfo.value = info
    token.value = info.token
    localStorage.setItem('admin_token', info.token)
  }

  const clearAuth = () => {
    token.value = ''
    adminInfo.value = null
    localStorage.removeItem('admin_token')
  }

  return { token, adminInfo, setAuth, clearAuth }
})
