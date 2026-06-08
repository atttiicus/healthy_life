import koaRouter from "koa-router"
import controllers from '../controller'
import controller from '../controller'

const router  = new koaRouter()

const project = {
  admin: "/admin",
  user: "/user",
  data: "/data",
  article: "/article",
  announcement: "/announcement",
}

// ─── 管理员用户 ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/user/register:
 *   post:
 *     tags: [管理员认证]
 *     summary: 管理员注册（无管理员时可用，否则返回 50002）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [account, password]
 *             properties:
 *               account:  { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/AdminUser'
 */
router.post(project.admin + "/user/register", controllers.admin_user_user.registerUserApi)

/**
 * @swagger
 * /admin/user/login:
 *   post:
 *     tags: [管理员认证]
 *     summary: 管理员登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [account, password]
 *             properties:
 *               account:  { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 登录成功，返回含 token 的管理员信息
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/AdminUser'
 */
router.post(project.admin + "/user/login", controller.admin_user_user.userLoginApi)
router.post(project.admin + "/user/updatePassword", controllers.admin_user_user.updatePasswordApi)
router.post(project.admin + "/user/delete", controllers.admin_user_user.deleteUserApi)

// ─── 普通用户 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags: [用户认证]
 *     summary: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [account, user_name, password]
 *             properties:
 *               account:   { type: string, example: "13800138000" }
 *               user_name: { type: string, example: "张三" }
 *               password:  { type: string, example: "test1234" }
 *               sex:       { type: string, enum: [男, 女] }
 *               age:       { type: integer, example: 25 }
 *               height:    { type: string,  example: "175" }
 *               weight:    { type: string,  example: "65" }
 *               email:     { type: string,  example: "user@example.com" }
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserInfo'
 */
router.post(project.user+"/register", controllers.user_user.registerUserApi)

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [用户认证]
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [account, password]
 *             properties:
 *               account:  { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 登录成功，返回含 token 的用户信息
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserInfo'
 */
router.post(project.user+"/login", controllers.user_user.loginApi)

// ─── 文章 ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /article/all:
 *   get:
 *     tags: [文章资讯]
 *     summary: 获取全部文章
 *     responses:
 *       200:
 *         description: 文章列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         result:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Article'
 */
router.get(project.article+"/all", controllers.article_article.getArticleListApi)

/**
 * @swagger
 * /article/find:
 *   get:
 *     tags: [文章资讯]
 *     summary: 按 ID 获取文章
 *     parameters:
 *       - name: aid
 *         in: query
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 文章详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 */
router.get(project.article+"/find", controllers.article_article.getArticleByAidApi)

/**
 * @swagger
 * /article/title/{title}:
 *   get:
 *     tags: [文章资讯]
 *     summary: 按标题模糊搜索文章
 *     parameters:
 *       - name: title
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 搜索结果
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         result:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Article'
 */
router.get(project.article+"/title/:title", controllers.article_article.getArticleByTitleListApi)

// ─── 公告 ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /announcement/list:
 *   get:
 *     tags: [公告]
 *     summary: 获取已发布公告列表
 *     responses:
 *       200:
 *         description: 公告列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:         { type: integer }
 *                           title:      { type: string }
 *                           content:    { type: string }
 *                           tag:        { type: string, enum: [NEW, FIX, INFO] }
 *                           author:     { type: string }
 *                           created_at: { type: string, format: date-time }
 */
router.get(project.announcement + '/list', controllers.announcement_announcement.getAnnouncementListApi)

// ─── 文件上传 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /upload:
 *   post:
 *     tags: [文件上传]
 *     summary: 上传图片
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: 上传成功，返回文件路径
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         path: { type: string }
 */
router.post("/upload",controllers.utils_file.uploadUserCover)

export default router
