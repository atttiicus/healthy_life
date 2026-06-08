import { Context, Next } from 'koa'
import { getAnnouncementListService } from '../../services/announcement/announcement'

export const getAnnouncementListApi = async (ctx: Context, next: Next) => {
  const list = await getAnnouncementListService()
  ctx.body = list.map(r => r.dataValues)
  return next()
}
