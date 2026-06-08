import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'users', component: () => import('../views/UsersView.vue') },
        { path: 'users/:uid/data', component: () => import('../views/UserDataView.vue') },
        { path: 'articles', component: () => import('../views/ArticlesView.vue') },
        { path: 'announcements', component: () => import('../views/AnnouncementsView.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) return '/login'
  if (to.path === '/login' && authStore.token) return '/dashboard'
})

export default router
