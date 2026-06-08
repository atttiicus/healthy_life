import koaRouter from 'koa-router'
import { jwtMiddlewareDeal } from '../middleware/jwt'
import controllers from '../controller'

const router = new koaRouter()
const project = {
  admin:   "/admin",
  user:    "/user",
  data:    "/data",
  article: "/article",
  plan:    "/plan",
  workout:     "/workout",
  checkin:     "/checkin",
  habit:       "/habit",
  achievement: "/achievement",
}

router.use(jwtMiddlewareDeal)

router.get('/test', controllers.test_test.testApi)

// ─── 用户 ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /user/writeOff:
 *   post:
 *     tags: [用户认证]
 *     summary: 注销当前账户
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 注销成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.post(project.user + "/writeOff", controllers.user_user.removeUserApi)

/**
 * @swagger
 * /user/update:
 *   post:
 *     tags: [用户认证]
 *     summary: 更新当前用户信息（uid 从 JWT 中取，无需传递）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               user_name: { type: string }
 *               sex:       { type: string }
 *               age:       { type: integer }
 *               weight:    { type: string }
 *               height:    { type: string }
 *               password:  { type: string, description: "新密码，不修改则不传" }
 *               avatar:    { type: string }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         update_number: { type: integer }
 */
router.post(project.user + "/update", controllers.user_user.updateUserInfoApi)

// ─── 每日数据 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /data/add:
 *   post:
 *     tags: [每日数据]
 *     summary: 新增/更新今日数据（当天已有则更新，uid 从 JWT 中取）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:       { type: string }
 *               calorie:      { type: integer }
 *               sleepTime:    { type: string, example: "07:30" }
 *               stepNum:      { type: integer }
 *               exerciseTime: { type: string }
 *               foods:        { type: string, example: "早餐:鸡蛋;午餐:米饭" }
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/DayData'
 */
router.post(project.data+"/add",    controllers.daydata_daydata.addDayData)

/**
 * @swagger
 * /data/update:
 *   post:
 *     tags: [每日数据]
 *     summary: 更新指定日数据（按 did）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [did]
 *             properties:
 *               did:          { type: integer }
 *               weight:       { type: string }
 *               calorie:      { type: integer }
 *               sleepTime:    { type: string }
 *               stepNum:      { type: integer }
 *               exerciseTime: { type: string }
 *               foods:        { type: string }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.post(project.data+"/update", controllers.daydata_daydata.updateCurrentDayData)

/**
 * @swagger
 * /data/find:
 *   get:
 *     tags: [每日数据]
 *     summary: 查询今日健康数据（uid 从 JWT 中取）
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 今日数据
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/DayData'
 */
router.get(project.data+"/find",    controllers.daydata_daydata.getCurrentDayData)

/**
 * @swagger
 * /data/history:
 *   get:
 *     tags: [每日数据]
 *     summary: 查询最近 N 天历史数据
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: days
 *         in: query
 *         schema: { type: integer, default: 7 }
 *         description: 查询最近 N 天
 *     responses:
 *       200:
 *         description: 历史数据列表（按日期升序）
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DayData'
 */
router.get(project.data+"/history", controllers.daydata_daydata.getDayDataHistory)

// ─── 健康计划 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /plan/get:
 *   get:
 *     tags: [健康计划]
 *     summary: 获取当前用户的健康计划
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 健康计划数据
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Plan'
 */
router.get(project.plan+"/get", controllers.plan_plan.getPlanDataApi)

/**
 * @swagger
 * /plan/set:
 *   post:
 *     tags: [健康计划]
 *     summary: 设置/更新健康计划（无则创建，有则更新）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloodPressure: { type: string }
 *               bmi:           { type: string }
 *               weight:        { type: string }
 *               heartRate:     { type: string }
 *               calorie:       { type: string }
 *               sleepTime:     { type: string }
 *               exerciseTime:  { type: string }
 *               kilometre:     { type: string, description: "目标步数" }
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Plan'
 */
router.post(project.plan+"/set", controllers.plan_plan.setPlanDataApi)

// ─── 运动记录（stats 必须在 :wid 之前注册）────────────────────────────────────

/**
 * @swagger
 * /workout/add:
 *   post:
 *     tags: [运动记录]
 *     summary: 新增运动记录（自动同步 dayData.exerciseTime）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, duration, started_at]
 *             properties:
 *               type:           { type: string, enum: [running, cycling, gym, swimming, other] }
 *               duration:       { type: integer, description: "分钟" }
 *               calories:       { type: integer }
 *               notes:          { type: string }
 *               started_at:     { type: string, format: date, example: "2026-06-05" }
 *               distance:       { type: number, description: "km，running/cycling 专属" }
 *               avg_pace:       { type: string, description: "mm:ss，running/cycling 专属" }
 *               avg_heart_rate: { type: integer, description: "bpm，running/cycling 专属" }
 *     responses:
 *       200:
 *         description: 新增成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 */
router.post(project.workout + '/add',   controllers.workout_workout.addWorkout)

/**
 * @swagger
 * /workout/list:
 *   get:
 *     tags: [运动记录]
 *     summary: 获取运动历史列表
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 10 }
 *       - name: type
 *         in: query
 *         schema: { type: string, enum: [running, cycling, gym, swimming, other] }
 *     responses:
 *       200:
 *         description: 分页列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         list:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Workout'
 */
router.get(project.workout  + '/list',  controllers.workout_workout.getWorkoutList)

/**
 * @swagger
 * /workout/stats:
 *   get:
 *     tags: [运动记录]
 *     summary: 运动统计（按类型聚合时长/卡路里/次数）
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: range
 *         in: query
 *         schema: { type: string, enum: [week, month], default: week }
 *     responses:
 *       200:
 *         description: 各类型汇总数据
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
 *                           type:           { type: string }
 *                           total_duration: { type: string }
 *                           total_calories: { type: string }
 *                           count:          { type: string }
 */
router.get(project.workout  + '/stats', controllers.workout_workout.getWorkoutStats)

/**
 * @swagger
 * /workout/{wid}:
 *   get:
 *     tags: [运动记录]
 *     summary: 获取单条运动详情
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: wid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 运动详情（含扩展数据）
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Workout'
 *   delete:
 *     tags: [运动记录]
 *     summary: 删除运动记录（软删除，自动重算当天 dayData.exerciseTime）
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: wid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         deleted: { type: boolean }
 */
router.get(project.workout    + '/:wid',  controllers.workout_workout.getWorkoutDetail)
router.delete(project.workout + '/:wid',  controllers.workout_workout.deleteWorkout)

// ─── 打卡系统 ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /checkin/do:
 *   post:
 *     tags: [打卡系统]
 *     summary: 今日打卡（幂等：重复打卡返回已有记录）
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note: { type: string, description: "打卡备注（选填）" }
 *     responses:
 *       200:
 *         description: 打卡成功或返回今日已有记录
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         cid:          { type: integer }
 *                         uid:          { type: integer }
 *                         checkin_date: { type: string, format: date }
 *                         note:         { type: string, nullable: true }
 */
router.post(project.checkin + '/do',      controllers.checkin_checkin.doCheckin)

/**
 * @swagger
 * /checkin/calendar:
 *   get:
 *     tags: [打卡系统]
 *     summary: 获取某月已打卡日期列表
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: year
 *         in: query
 *         required: true
 *         schema: { type: integer, example: 2026 }
 *       - name: month
 *         in: query
 *         required: true
 *         schema: { type: integer, example: 6, minimum: 1, maximum: 12 }
 *     responses:
 *       200:
 *         description: 该月打卡日期数组
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items: { type: string, format: date }
 *                       example: ["2026-06-01","2026-06-03"]
 */
router.get(project.checkin + '/calendar', controllers.checkin_checkin.getCalendar)

/**
 * @swagger
 * /checkin/streak:
 *   get:
 *     tags: [打卡系统]
 *     summary: 获取连续打卡天数（截至最近一次打卡，今天未打卡不清零）
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 连续打卡天数及最近打卡日期
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiOk'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         streak:       { type: integer, example: 7 }
 *                         last_checkin: { type: string, format: date, nullable: true }
 */
router.get(project.checkin + '/streak',   controllers.checkin_checkin.getStreak)

// ─── 习惯养成 ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /habit/list:
 *   get:
 *     tags: [习惯养成]
 *     summary: 获取习惯列表（含今日是否已打卡、累计完成天数）
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 习惯列表
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
 *                           hid:           { type: integer }
 *                           title:         { type: string }
 *                           icon:          { type: string }
 *                           target_days:   { type: integer }
 *                           checked_today: { type: boolean }
 *                           total_days:    { type: integer }
 * /habit/create:
 *   post:
 *     tags: [习惯养成]
 *     summary: 创建新习惯
 *     security:
 *       - UserToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:       { type: string }
 *               icon:        { type: string, example: "star-o" }
 *               target_days: { type: integer, example: 21 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.get(project.habit + '/list',         controllers.habit_habit.getHabitListApi)
router.post(project.habit + '/create',      controllers.habit_habit.createHabitApi)

/**
 * @swagger
 * /habit/{hid}/check:
 *   post:
 *     tags: [习惯养成]
 *     summary: 今日打卡（幂等，重复调用不报错）
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: hid
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 打卡成功
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 * /habit/{hid}:
 *   delete:
 *     tags: [习惯养成]
 *     summary: 删除习惯
 *     security:
 *       - UserToken: []
 *     parameters:
 *       - name: hid
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
router.post(project.habit + '/:hid/check', controllers.habit_habit.checkHabitApi)
router.delete(project.habit + '/:hid',     controllers.habit_habit.deleteHabitApi)

// ─── 成就系统 ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /achievement/list:
 *   get:
 *     tags: [成就系统]
 *     summary: 获取全部成就（含已解锁状态，自动触发解锁检查）
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 成就列表
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
 *                           id:             { type: integer }
 *                           code:           { type: string }
 *                           title:          { type: string }
 *                           description:    { type: string }
 *                           icon:           { type: string }
 *                           condition_type: { type: string }
 *                           condition_value: { type: integer }
 *                           unlocked:       { type: boolean }
 *                           unlocked_at:    { type: string, nullable: true }
 * /achievement/mine:
 *   get:
 *     tags: [成就系统]
 *     summary: 获取我已解锁的成就
 *     security:
 *       - UserToken: []
 *     responses:
 *       200:
 *         description: 已解锁成就列表
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiOk' }
 */
router.get(project.achievement + '/list', controllers.achievement_achievement.getAchievementListApi)
router.get(project.achievement + '/mine', controllers.achievement_achievement.getMyAchievementsApi)

export default router
