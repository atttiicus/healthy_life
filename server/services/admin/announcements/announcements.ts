import Announcement from '../../../models/announcement'

export const getAdminAnnouncementListService = (page: number, limit: number) => {
  return Announcement.findAndCountAll({
    where: { is_del: 0 },
    order: [['created_at', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  })
}

export const createAnnouncementService = (params: {
  title: string
  content: string
  tag?: string
  author?: string
  is_active?: boolean
}) => {
  return Announcement.create({ ...params })
}

export const updateAnnouncementService = (id: number, params: Record<string, unknown>) => {
  return Announcement.update(params, { where: { id, is_del: 0 } })
}

export const deleteAnnouncementService = (id: number) => {
  return Announcement.update({ is_del: 1 }, { where: { id } })
}
