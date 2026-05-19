import { Context, Next } from 'koa'
import { CODE } from '../../../config/code'
import { getUserListService, updateUserService, deleteUserService } from '../../../services/admin/users/users'

export const getUserListApi = async (ctx: Context, next: Next) => {
  const { page = '1', limit = '10', keyword } = ctx.request.query
  const result = await getUserListService(
    Number(page),
    Number(limit),
    keyword ? String(keyword) : undefined
  )
  ctx.body = { list: result.rows.map(r => r.dataValues), total: result.count }
  return next()
}

export const updateUserApi = async (ctx: Context, next: Next) => {
  const uid = Number(ctx.params.uid)
  if (isNaN(uid)) throw CODE.errorTypeParameters
  await updateUserService(uid, ctx.request.body)
  ctx.body = { success: true }
  return next()
}

export const deleteUserApi = async (ctx: Context, next: Next) => {
  const uid = Number(ctx.params.uid)
  if (isNaN(uid)) throw CODE.errorTypeParameters
  await deleteUserService(uid)
  ctx.body = { success: true }
  return next()
}
