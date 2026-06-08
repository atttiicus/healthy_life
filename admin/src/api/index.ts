import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers['token'] = authStore.token
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    if (code === 20000) return data
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error) => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export const adminLogin = (data: { account: string; password: string }) =>
  request.post('/admin/user/login', data)

export const adminRegister = (data: { account: string; password: string }) =>
  request.post('/admin/user/register', data)

export const getStats = () => request.get('/admin/manage/stats')

export const getUserList = (params: { page: number; limit: number; keyword?: string }) =>
  request.get('/admin/manage/users', { params })

export const deleteUser = (uid: number) => request.delete(`/admin/manage/users/${uid}`)

export const getArticleList = (params: { page: number; limit: number; keyword?: string }) =>
  request.get('/admin/manage/articles', { params })

export const createArticle = (data: Record<string, unknown>) =>
  request.post('/admin/manage/articles', data)

export const updateArticle = (aid: number, data: Record<string, unknown>) =>
  request.put(`/admin/manage/articles/${aid}`, data)

export const deleteArticle = (aid: number) => request.delete(`/admin/manage/articles/${aid}`)

export const getAnnouncementList = (params: { page: number; limit: number }) =>
  request.get('/admin/manage/announcements', { params })

export const createAnnouncement = (data: Record<string, unknown>) =>
  request.post('/admin/manage/announcements', data)

export const updateAnnouncement = (id: number, data: Record<string, unknown>) =>
  request.put(`/admin/manage/announcements/${id}`, data)

export const deleteAnnouncement = (id: number) => request.delete(`/admin/manage/announcements/${id}`)
