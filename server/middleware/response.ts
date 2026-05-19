import Koa from 'koa'
import { CODE } from '../config/code'
import { logger } from '../log/log'

export const responseHandler = (ctx: Koa.Context) => {
  if (ctx.body !== undefined && ctx.body !== null) {
    ctx.type = "json"
    ctx.body = {
      code: CODE.success.code,
      data: ctx.body,
      message: CODE.success.message
    }
  }
}

export const errorHandler = (ctx: Koa.Context, next: Koa.Next) => {
  return next().catch((err) => {
    if (typeof err === "object" && err !== null) {
      ctx.body = {
        code: err.code ?? -1,
        data: null,
        message: err.message ?? "未知错误"
      }
    } else {
      ctx.body = {
        code: -1,
        data: null,
        message: String(err)
      }
    }

    logger.error(err)
    ctx.status = 200
    return Promise.resolve()
  })
}
