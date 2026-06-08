import { Context, Next } from 'koa'
import { CODE } from '../../config/code'
import {
  createHabitService,
  getHabitListService,
  checkHabitService,
  deleteHabitService,
} from '../../services/habit/habit'

export const createHabitApi = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const { title, icon, target_days } = ctx.request.body
  if (!title) throw CODE.missingParameters

  const result = await createHabitService(uid, {
    title,
    icon,
    target_days: target_days ? Number(target_days) : undefined,
  })
  ctx.body = result.dataValues
  return next()
}

export const getHabitListApi = async (ctx: Context, next: Next) => {
  ctx.body = await getHabitListService(ctx.userId)
  return next()
}

export const checkHabitApi = async (ctx: Context, next: Next) => {
  const hid = Number(ctx.params.hid)
  if (isNaN(hid)) throw CODE.errorTypeParameters

  const result = await checkHabitService(ctx.userId, hid)
  if (!result) throw CODE.habitNotFound

  ctx.body = { success: true }
  return next()
}

export const deleteHabitApi = async (ctx: Context, next: Next) => {
  const hid = Number(ctx.params.hid)
  if (isNaN(hid)) throw CODE.errorTypeParameters

  const result = await deleteHabitService(ctx.userId, hid)
  if (!result) throw CODE.habitNotFound

  ctx.body = { success: true }
  return next()
}
