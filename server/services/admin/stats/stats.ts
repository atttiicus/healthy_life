import NormalUser from '../../../models/normalUser'
import Article from '../../../models/article'
import DayData from '../../../models/dayData'

export const getStatsService = async () => {
  const [userCount, articleCount, dataCount] = await Promise.all([
    NormalUser.count({ where: { is_del: 0 } }),
    Article.count({ where: { is_del: 0 } }),
    DayData.count({ where: { is_del: 0 } }),
  ])
  return { userCount, articleCount, dataCount }
}
