import { Context, Next } from 'koa'
import { CODE } from '../../../config/code'
import {
  getAdminAnnouncementListService,
  createAnnouncementService,
  updateAnnouncementService,
  deleteAnnouncementService,
} from '../../../services/admin/announcements/announcements'

export const getAnnouncementListApi = async (ctx: Context, next: Next) => {
  const { page = '1', limit = '10' } = ctx.request.query
  const result = await getAdminAnnouncementListService(Number(page), Number(limit))
  ctx.body = { list: result.rows.map(r => r.dataValues), total: result.count }
  return next()
}

export const createAnnouncementApi = async (ctx: Context, next: Next) => {
  const { title, content, tag, author, is_active } = ctx.request.body
  if (!title || !content) throw CODE.missingParameters
  const result = await createAnnouncementService({ title, content, tag, author, is_active })
  ctx.body = result.dataValues
  return next()
}

export const updateAnnouncementApi = async (ctx: Context, next: Next) => {
  const id = Number(ctx.params.id)
  if (isNaN(id)) throw CODE.errorTypeParameters
  await updateAnnouncementService(id, ctx.request.body)
  ctx.body = { success: true }
  return next()
}

export const deleteAnnouncementApi = async (ctx: Context, next: Next) => {
  const id = Number(ctx.params.id)
  if (isNaN(id)) throw CODE.errorTypeParameters
  await deleteAnnouncementService(id)
  ctx.body = { success: true }
  return next()
}
