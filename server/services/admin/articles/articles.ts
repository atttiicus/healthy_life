import { Op } from 'sequelize'
import Article from '../../../models/article'

type ArticleCreateParams = {
  title: string
  content: string
  author?: string
  type?: number
  image?: string
}

export const getArticleListService = (page: number, limit: number, keyword?: string) => {
  const where: Record<string | symbol, unknown> = { is_del: 0 }
  if (keyword) {
    where[Op.or] = [
      { title: { [Op.like]: `%${keyword}%` } },
      { author: { [Op.like]: `%${keyword}%` } },
    ]
  }
  return Article.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['created_at', 'DESC']],
  })
}

export const createArticleService = (params: ArticleCreateParams) => {
  return Article.create({ author: '佚名', type: 0, image: '1.jpg', ...params })
}

export const updateArticleService = (aid: number, params: Record<string, unknown>) => {
  return Article.update(params, { where: { aid, is_del: 0 } })
}

export const deleteArticleService = (aid: number) => {
  return Article.update({ is_del: 1 }, { where: { aid } })
}
