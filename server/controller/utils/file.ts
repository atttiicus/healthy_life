import path from 'path'
import { Context, Next } from 'koa'
import { NGINX_STATIC_PATH, STATIC_BASE_URL } from '../../config/constant'
import { CODE } from '../../config/code'

const uploadDir = NGINX_STATIC_PATH.uploadPath

export const uploadUserCover = async (ctx: Context, next: Next) => {
  const file = ctx.request.files?.file

  if (Array.isArray(file) || !file) throw CODE.errorImageUploadParameters

  const relativePath = path.relative(uploadDir, file.filepath).replace(/\\/g, '/')
  ctx.body = {
    msg: 'File uploaded successfully',
    path: `${STATIC_BASE_URL}${relativePath}`
  }

  return next()
}
