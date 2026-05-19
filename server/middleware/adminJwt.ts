import Koa from 'koa'
import { verifyJWTToken } from '../utils/util'
import { CODE } from '../config/code'
import { getUserInfoByIdService } from '../services/admin/user/user'
import { JWT } from '../config/constant'

export const adminJwtMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const token = ctx.request.headers.token

  if (typeof token !== "string") throw CODE.tokenFailed

  try {
    const decoded = verifyJWTToken(token, JWT.secret)
    const adminId = decoded.userId

    if (typeof adminId !== 'number') throw CODE.tokenFailed

    const adminInfo = await getUserInfoByIdService(adminId)
    if (!adminInfo) throw CODE.tokenFailed

    ctx.adminId = adminId
    ctx.adminInfo = adminInfo.dataValues as Record<string, unknown>
  } catch {
    throw CODE.tokenFailed
  }

  return next()
}
