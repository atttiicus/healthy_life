import koaRouter from 'koa-router'
import { adminJwtMiddleware } from '../middleware/adminJwt'
import controllers from '../controller'

const router = new koaRouter()

router.use(adminJwtMiddleware)

// ─── 统计 ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/manage/stats:
 *   get:
 *     tags: [管理员-统计]
 *     summary: 系统统计（用户数 / 文章数 / 健康记录数）
 *     security:
 *       - AdminToken: []
 *     responses:
 *       200:
 *         description: 统计数据
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         userCount:    { type: integer }
 *                         articleCount: { type: integer }
 *                         dataCount:    { type: integer }
 */
router.get('/admin/manage/stats', controllers.admin_stats_stats.getStatsApi)

// ─── 用户管理 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/manage/users:
 *   get:
 *     tags: [管理员-用户管理]
 *     summary: 获取用户列表（分页 + 关键词搜索）
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 10 }
 *       - name: keyword
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 用户列表（分页）
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.get('/admin/manage/users', controllers.admin_users_users.getUserListApi)

/**
 * @swagger
 * /admin/manage/users/{uid}:
 *   put:
 *     tags: [管理员-用户管理]
 *     summary: 更新指定用户信息
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 *   delete:
 *     tags: [管理员-用户管理]
 *     summary: 软删除用户
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.put('/admin/manage/users/:uid', controllers.admin_users_users.updateUserApi)
router.delete('/admin/manage/users/:uid', controllers.admin_users_users.deleteUserApi)

/**
 * @swagger
 * /admin/manage/users/{uid}/data:
 *   get:
 *     tags: [管理员-用户管理]
 *     summary: 查看指定用户的健康数据记录（分页）
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: 健康数据列表（分页）
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.get('/admin/manage/users/:uid/data', controllers.admin_users_users.getUserHealthDataApi)

// ─── 文章管理 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/manage/articles:
 *   get:
 *     tags: [管理员-文章管理]
 *     summary: 获取文章列表（分页 + 关键词）
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 10 }
 *       - name: keyword
 *         in: query
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 文章列表
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 *   post:
 *     tags: [管理员-文章管理]
 *     summary: 创建文章
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               type:    { type: integer, description: "0=原创 1=转载 2=未知" }
 *               title:   { type: string }
 *               content: { type: string }
 *               author:  { type: string }
 *               image:   { type: string }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 */
router.get('/admin/manage/articles', controllers.admin_articles_articles.getArticleListApi)
router.post('/admin/manage/articles', controllers.admin_articles_articles.createArticleApi)

/**
 * @swagger
 * /admin/manage/articles/{aid}:
 *   put:
 *     tags: [管理员-文章管理]
 *     summary: 更新文章
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: aid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 *   delete:
 *     tags: [管理员-文章管理]
 *     summary: 软删除文章
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: aid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.put('/admin/manage/articles/:aid', controllers.admin_articles_articles.updateArticleApi)
router.delete('/admin/manage/articles/:aid', controllers.admin_articles_articles.deleteArticleApi)

// ─── 公告管理 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/manage/announcements:
 *   get:
 *     tags: [管理员-公告管理]
 *     summary: 获取公告列表（分页）
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 公告列表
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 *   post:
 *     tags: [管理员-公告管理]
 *     summary: 创建公告
 *     security:
 *       - AdminToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:     { type: string }
 *               content:   { type: string }
 *               tag:       { type: string, enum: [NEW, FIX, INFO] }
 *               author:    { type: string }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.get('/admin/manage/announcements', controllers.admin_announcements_announcements.getAnnouncementListApi)
router.post('/admin/manage/announcements', controllers.admin_announcements_announcements.createAnnouncementApi)

/**
 * @swagger
 * /admin/manage/announcements/{id}:
 *   put:
 *     tags: [管理员-公告管理]
 *     summary: 更新公告
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 *   delete:
 *     tags: [管理员-公告管理]
 *     summary: 删除公告
 *     security:
 *       - AdminToken: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.put('/admin/manage/announcements/:id', controllers.admin_announcements_announcements.updateAnnouncementApi)
router.delete('/admin/manage/announcements/:id', controllers.admin_announcements_announcements.deleteAnnouncementApi)

export default router
