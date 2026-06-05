import bcrypt from 'bcryptjs'
import AdminUser from '../../../models/adminUser'

export const countAdminService = () => AdminUser.count()

const SALT_ROUNDS = 10

export const getUserInfoByIdService = (userId: number) => {
  return AdminUser.findOne({ where: { id: userId }, attributes: { exclude: ["password"] } })
}

export const getUserInfoAccountService = (account: string) => {
  return AdminUser.findOne({ where: { account } })
}

export const registerUserService = async (params: { account: string, password: string }) => {
  const hashedPassword = await bcrypt.hash(params.password, SALT_ROUNDS)
  return AdminUser.create({ ...params, password: hashedPassword, level: 1 })
}

export const updateUserInfoServices = (updateInfo: { token?: string }, targetUserId: number) => {
  return AdminUser.update(updateInfo, { where: { id: targetUserId } })
}
