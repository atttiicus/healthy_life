import { Context, Next } from 'koa'
import { CODE } from '../../../config/code'
import {
  getArticleListService,
  createArticleService,
  updateArticleService,
  deleteArticleService,
} from '../../../services/admin/articles/articles'

export const getArticleListApi = async (ctx: Context, next: Next) => {
  const { page = '1', limit = '10', keyword } = ctx.request.query
  const result = await getArticleListService(
    Number(page),
    Number(limit),
    keyword ? String(keyword) : undefined
  )
  ctx.body = { list: result.rows.map(r => r.dataValues), total: result.count }
  return next()
}

export const createArticleApi = async (ctx: Context, next: Next) => {
  const { title, content, author, type, image } = ctx.request.body
  if (!title || !content) throw CODE.missingParameters
  const result = await createArticleService({ title, content, author, type: Number(type), image })
  ctx.body = result.dataValues
  return next()
}

export const updateArticleApi = async (ctx: Context, next: Next) => {
  const aid = Number(ctx.params.aid)
  if (isNaN(aid)) throw CODE.errorTypeParameters
  await updateArticleService(aid, ctx.request.body)
  ctx.body = { success: true }
  return next()
}

export const deleteArticleApi = async (ctx: Context, next: Next) => {
  const aid = Number(ctx.params.aid)
  if (isNaN(aid)) throw CODE.errorTypeParameters
  await deleteArticleService(aid)
  ctx.body = { success: true }
  return next()
}
