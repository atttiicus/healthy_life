import { Context, Next } from 'koa'
import { getAchievementListService, getMyAchievementsService } from '../../services/achievement/achievement'

export const getAchievementListApi = async (ctx: Context, next: Next) => {
  ctx.body = await getAchievementListService(ctx.userId)
  return next()
}

export const getMyAchievementsApi = async (ctx: Context, next: Next) => {
  ctx.body = await getMyAchievementsService(ctx.userId)
  return next()
}
