import { Context, Next } from 'koa'
import { CODE } from '../../config/code'
import {
  doCheckinService,
  getCalendarService,
  getStreakService,
} from '../../services/checkin/checkin'

export const doCheckin = async (ctx: Context, next: Next) => {
  const uid      = ctx.userId
  const { note } = ctx.request.body

  const result = await doCheckinService(uid, note)
  ctx.body = result.dataValues
  return next()
}

export const getCalendar = async (ctx: Context, next: Next) => {
  const uid           = ctx.userId
  const { year, month } = ctx.request.query

  if (!year || !month) throw CODE.missingParameters

  const y = Number(year)
  const m = Number(month)
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) throw CODE.errorTypeParameters

  ctx.body = await getCalendarService(uid, y, m)
  return next()
}

export const getStreak = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  ctx.body  = await getStreakService(uid)
  return next()
}
