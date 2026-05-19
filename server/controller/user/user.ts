import bcrypt from 'bcryptjs'
import { Context, Next } from 'koa'
import { CODE } from '../../config/code'
import {
  deleteUserByUidService,
  getUserByAccountService,
  getUserInfosService,
  registerUserService,
  updateUserInfoService
} from '../../services/user/user'
import { generatorToken } from '../../utils/util'

export const registerUserApi = async (ctx: Context, next: Next) => {
  const { account, user_name, password } = ctx.request.body
  if (!account || !user_name || !password) throw CODE.missingParameters

  const accountExistInfo = await getUserByAccountService(account)
  if (accountExistInfo) throw CODE.userIsExist

  const { sex, age, email, height, weight, user_tag } = ctx.request.body
  const resultUserInfo = await registerUserService(
    { account, user_name, password, sex, age, email, height, weight, user_tag }
  )
  ctx.body = resultUserInfo.dataValues

  return next()
}

export const loginApi = async (ctx: Context, next: Next) => {
  const { account, password } = ctx.request.body
  if (!account || !password) throw CODE.missingParameters

  const userInfo = await getUserByAccountService(account)
  if (!userInfo) throw CODE.userNotExist

  const isPasswordCorrect = await bcrypt.compare(String(password), userInfo.dataValues.password)
  if (!isPasswordCorrect) throw CODE.passwordFailed

  const uid = userInfo.dataValues.uid
  const token = generatorToken(uid)
  await updateUserInfoService(uid, { token })

  const resultUserInfo = await getUserInfosService(uid)
  ctx.body = resultUserInfo?.dataValues

  return next()
}

export const removeUserApi = async (ctx: Context, next: Next) => {
  const { uid } = ctx.request.body
  if (!uid) throw CODE.missingParameters

  const userInfo = await getUserInfosService(uid)
  if (!userInfo) throw CODE.userIdError

  const result = await deleteUserByUidService(uid)
  ctx.body = { delete_number: result[0] }

  return next()
}

export const updateUserInfoApi = async (ctx: Context, next: Next) => {
  const { uid, ...params } = ctx.request.body
  if (!uid) throw CODE.needMissingParameters

  const userInfo = await getUserInfosService(uid)
  if (!userInfo) throw CODE.userNotExist

  const result = await updateUserInfoService(uid, { ...params })
  ctx.body = { update_number: result[0] }

  return next()
}
