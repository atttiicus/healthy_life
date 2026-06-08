import Announcement from '../../models/announcement'

export const getAnnouncementListService = () => {
  return Announcement.findAll({
    where: { is_active: true, is_del: 0 },
    order: [['created_at', 'DESC']],
    attributes: ['id', 'title', 'content', 'tag', 'author', 'created_at'],
  })
}
