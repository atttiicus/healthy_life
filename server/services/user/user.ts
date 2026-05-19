import bcrypt from 'bcrypt'
import NormalUser from '../../models/normalUser'

const SALT_ROUNDS = 10

type registerParams = {
  account: string,
  user_name: string,
  password: string,
  age?: number,
  sex?: string,
  height?: string,
  weight?: string,
  email?: string,
  user_tag?: Array<string>,
}

type updateParams = {
  user_name?: string,
  password?: string,
  email?: string,
  age?: number,
  sex?: string,
  height?: string,
  weight?: string,
  user_tag?: Array<string>,
  token?: string,
}

export const getUserInfosService = (uid: number) => {
  return NormalUser.findOne({ where: { uid, is_del: 0 }, attributes: { exclude: ["password", "is_del"] } })
}

export const getUserByAccountService = (account: string) => {
  return NormalUser.findOne({ where: { account, is_del: 0 } })
}

export const registerUserService = async (params: registerParams) => {
  const hashedPassword = await bcrypt.hash(params.password, SALT_ROUNDS)
  return NormalUser.create({ ...params, password: hashedPassword })
}

export const updateUserInfoService = (uid: number, updateInfo: updateParams) => {
  return NormalUser.update(updateInfo, { where: { uid, is_del: 0 } })
}

export const deleteUserByUidService = (uid: number) => {
  return NormalUser.update({ is_del: 1 }, { where: { uid } })
}
