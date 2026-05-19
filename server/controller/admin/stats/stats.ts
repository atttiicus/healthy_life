import { Context, Next } from 'koa'
import { getStatsService } from '../../../services/admin/stats/stats'

export const getStatsApi = async (ctx: Context, next: Next) => {
  ctx.body = await getStatsService()
  return next()
}
