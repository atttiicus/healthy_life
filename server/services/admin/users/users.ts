import { Op } from 'sequelize'
import NormalUser from '../../../models/normalUser'

export const getUserListService = (page: number, limit: number, keyword?: string) => {
  const where: Record<string | symbol, unknown> = { is_del: 0 }
  if (keyword) {
    where[Op.or] = [
      { account: { [Op.like]: `%${keyword}%` } },
      { user_name: { [Op.like]: `%${keyword}%` } },
    ]
  }
  return NormalUser.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit,
    offset: (page - 1) * limit,
    order: [['created_at', 'DESC']],
  })
}

export const updateUserService = (uid: number, params: Record<string, unknown>) => {
  return NormalUser.update(params, { where: { uid, is_del: 0 } })
}

export const deleteUserService = (uid: number) => {
  return NormalUser.update({ is_del: 1 }, { where: { uid } })
}
