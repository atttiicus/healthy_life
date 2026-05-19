import bcrypt from 'bcrypt'
import { Context, Next } from 'koa'
import { CODE } from '../../../config/code'
import {
  getUserInfoAccountService,
  getUserInfoByIdService,
  registerUserService,
  updateUserInfoServices
} from '../../../services/admin/user/user'
import { generatorToken } from '../../../utils/util'

export const registerUserApi = async (ctx: Context, next: Next) => {
  const { account, password } = ctx.request.body
  if (!account || !password) throw CODE.missingParameters

  const accountExistInfo = await getUserInfoAccountService(account)
  if (accountExistInfo) throw CODE.adminUserIsExist

  const registerInfo = await registerUserService({ account, password })
  ctx.body = registerInfo.dataValues

  return next()
}

export const userLoginApi = async (ctx: Context, next: Next) => {
  const { account, password } = ctx.request.body || {}
  if (!account || !password) throw CODE.missingParameters

  const accountInfo = await getUserInfoAccountService(account)
  if (!accountInfo) throw CODE.userNotExist

  const isPasswordCorrect = await bcrypt.compare(String(password), accountInfo.dataValues.password)
  if (!isPasswordCorrect) throw CODE.passwordFailed

  const userId = accountInfo.dataValues.id
  const token = generatorToken(userId)
  await updateUserInfoServices({ token }, userId)

  const realUserInfo = await getUserInfoByIdService(userId)
  ctx.body = realUserInfo?.dataValues

  return next()
}

export const updatePasswordApi = async (ctx: Context, next: Next) => {
  return next()
}

export const deleteUserApi = async (ctx: Context, next: Next) => {
  return next()
}
