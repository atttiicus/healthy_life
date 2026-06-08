import { Context, Next } from 'koa'
import { CODE } from '../../config/code'
import { logMoodService, getTodayMoodService, getMoodHistoryService } from '../../services/mood/mood'

export const logMoodApi = async (ctx: Context, next: Next) => {
  const uid  = ctx.userId
  const { mood, note } = ctx.request.body
  const moodNum = Number(mood)
  if (!mood || isNaN(moodNum) || moodNum < 1 || moodNum > 5) throw CODE.errorTypeParameters

  const result = await logMoodService(uid, moodNum, note)
  ctx.body = result.dataValues
  return next()
}

export const getTodayMoodApi = async (ctx: Context, next: Next) => {
  const result = await getTodayMoodService(ctx.userId)
  ctx.body = result ? result.dataValues : null
  return next()
}

export const getMoodHistoryApi = async (ctx: Context, next: Next) => {
  const { days } = ctx.request.query
  const list = await getMoodHistoryService(ctx.userId, Number(days) || 30)
  ctx.body = list.map(r => r.dataValues)
  return next()
}
