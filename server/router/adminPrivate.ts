import koaRouter from 'koa-router'
import { adminJwtMiddleware } from '../middleware/adminJwt'
import controllers from '../controller'

const router = new koaRouter()

router.use(adminJwtMiddleware)

router.get('/admin/manage/stats', controllers.admin_stats_stats.getStatsApi)

router.get('/admin/manage/users', controllers.admin_users_users.getUserListApi)
router.put('/admin/manage/users/:uid', controllers.admin_users_users.updateUserApi)
router.delete('/admin/manage/users/:uid', controllers.admin_users_users.deleteUserApi)

router.get('/admin/manage/articles', controllers.admin_articles_articles.getArticleListApi)
router.post('/admin/manage/articles', controllers.admin_articles_articles.createArticleApi)
router.put('/admin/manage/articles/:aid', controllers.admin_articles_articles.updateArticleApi)
router.delete('/admin/manage/articles/:aid', controllers.admin_articles_articles.deleteArticleApi)

export default router
