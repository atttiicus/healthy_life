import Koa from 'koa'
import { verifyJWTToken } from '../utils/util'
import { CODE } from '../config/code'
import { getUserInfosService } from '../services/user/user'
import { JWT } from '../config/constant'

export const jwtMiddlewareDeal = async (ctx: Koa.Context, next: Koa.Next) => {
  const token = ctx.request.headers.token

  if (typeof token !== "string") throw CODE.tokenFailed

  try {
    const decoded = verifyJWTToken(token, JWT.secret)
    const userId = decoded.userId

    if (typeof userId !== 'number') throw CODE.tokenFailed

    const userInfo = await getUserInfosService(userId)
    if (!userInfo) throw CODE.tokenFailed

    ctx.userId = userId
    ctx.userInfo = userInfo
  } catch (err) {
    throw CODE.tokenFailed
  }

  return next()
}
