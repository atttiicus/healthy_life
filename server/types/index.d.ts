declare module 'koa' {
  interface DefaultContext {
    userId?: number
    userInfo?: Record<string, unknown>
    adminId?: number
    adminInfo?: Record<string, unknown>
  }
}
