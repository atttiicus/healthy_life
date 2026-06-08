# 健康生活 Healthy Life

基于 UniApp + Vue 2 的全功能健康管理小程序，配套 Koa2 后端 API 与 Vue 3 管理中台。

---

## 技术栈

| 模块 | 技术 |
|---|---|
| 用户端小程序 | UniApp · Vue 2 · Vuex · Vant 2 · ECharts · UnoCSS |
| 管理中台 | Vue 3 · Vite · Element Plus · TypeScript · Pinia |
| 后端服务 | Node.js 18 · Koa2 · TypeScript · Sequelize 6 |
| 数据库 | PostgreSQL（Supabase 云托管） |
| API 文档 | swagger-jsdoc · swagger-ui-koa |

---

## 项目结构

```
healthy_life/
├── app/          用户端小程序（UniApp Vue 2，端口 8080）
├── server/       后端 API 服务（Koa2，端口 2233）
├── admin/        管理中台（Vue 3，端口 5173）
├── start.sh      一键启动脚本
└── .ai_docs/     开发文档与完成报告
```

---

## 快速启动

### 一键启动（推荐）

```bash
bash start.sh dev    # 并发启动后端 + 中台 + 小程序
bash start.sh prod   # 构建前端 + PM2 启动后端
```

### 手动启动

```bash
# 1. 后端（:2233）
cd server && pnpm install && pnpm run dev

# 2. 管理中台（:5173）
cd admin && npm install && npm run dev

# 3. 用户端（:8080）
cd app && npm install && npm run dev:h5
```

---

## 环境配置

```bash
cp server/.env.example server/.env
```

| 变量 | 说明 |
|---|---|
| `DB_NAME` | 数据库名（默认 `postgres`） |
| `DB_USER` | Supabase 用户（格式：`postgres.your_ref`） |
| `DB_PASSWORD` | 数据库密码 |
| `DB_HOST` | Supabase pooler 地址 |
| `DB_PORT` | 端口（默认 `5432`） |
| `JWT_SECRET` | JWT 签名密钥 |
| `STATIC_UPLOAD_PATH` | 文件上传保存目录 |
| `STATIC_BASE_URL` | 静态文件访问地址 |

首次启动后端，Sequelize `alter: true` 自动建表，无需手动执行 SQL。

**首次注册管理员：**

```bash
curl -X POST http://localhost:2233/admin/user/register \
  -H "Content-Type: application/json" \
  -d '{"account":"admin","password":"yourpass"}'
```

**API 文档：** 启动后访问 `http://localhost:2233/api-docs`

---

## 功能模块

### 用户端小程序

| 页面 | 路径 | 功能 |
|---|---|---|
| 主页 | `pages/index/index` | 体重/BMI/体脂率、卡路里进度、步数/运动进度、睡眠图表、健康建议、每日打卡入口 |
| 生活空间 | `pages/life/index` | 综合健康评分、周/月/年趋势图（睡眠/体重/步数/热量） |
| 健康报告 | `pages/life/report` | 各指标详细进度报告 |
| 运动记录 | `pages/workout/index` | 运动历史列表、本周统计（时长/卡路里/次数） |
| 新增运动 | `pages/workout/add` | 5 种运动类型、距离/配速/心率扩展字段 |
| 运动详情 | `pages/workout/detail` | 单次运动详情、删除 |
| 打卡日历 | `pages/checkin/calendar` | 月历视图、连续打卡天数、每日打卡 |
| 习惯养成 | `pages/habit/index` | 自定义习惯、进度条、每日打卡（21/30/66 天目标） |
| 成就系统 | `pages/achievement/index` | 8 个预置成就、自动解锁检测 |
| 健康日历 | `pages/calendar/index` | 月历视图、点击查看/链接编辑当日健康数据 |
| 心情日记 | `pages/mood/index` | 5 级心情记录、备注、近30天历史 |
| 资讯 | `pages/article/index` | 健康文章列表、关键词搜索 |
| 官方公告 | `pages/user/announcement` | 动态公告列表（从后端拉取） |
| 个人中心 | `pages/user/index` | 用户信息、各项指标、跳转各功能入口 |
| 登录/注册 | `pages/user/login` `register` | JWT 认证，密码 bcrypt 加密 |
| 编辑资料 | `pages/user/update` | 修改用户名、密码、身高体重等 |

### 管理中台

访问 `http://localhost:5173`

| 页面 | 功能 |
|---|---|
| 数据概览 | 用户数、文章数、健康记录数 |
| 用户管理 | 列表/搜索/分页/删除，点击查看用户健康数据 |
| 用户健康数据 | 分页展示指定用户的全部日健康记录 |
| 文章管理 | 列表/搜索/新增/编辑/删除 |
| 公告管理 | 新增/编辑/删除公告，支持 NEW/FIX/INFO 标签，控制发布状态 |

---

## 数据库模型

| 模型文件 | 表名 | 说明 |
|---|---|---|
| `normalUser` | normal_user | 普通用户账号 |
| `adminUser` | admin_user | 管理员账号 |
| `dayData` | day_data | 每日健康数据（体重/卡路里/步数/运动/睡眠/饮食） |
| `plan` | plan | 健康计划目标 |
| `article` | article | 健康文章 |
| `workout` | workout | 运动记录（类型/时长/卡路里/日期） |
| `workoutRunDetail` | workout_run_detail | 跑步/骑行扩展数据（距离/配速/心率） |
| `checkin` | checkin | 每日打卡记录 |
| `habit` | habit | 用户自定义习惯定义 |
| `habitLog` | habit_log | 习惯每日打卡记录 |
| `achievementDef` | achievement_def | 成就定义（预置 8 条） |
| `userAchievement` | user_achievement | 用户已解锁成就 |
| `announcement` | announcement | 官方公告 |
| `moodLog` | mood_log | 每日心情记录（1~5 级） |

---

## API 参考

所有响应格式统一：`{ code: 20000, data: {}, message: "success" }`

Token 通过请求头 `token` 传递（非 `Authorization: Bearer`）。

### 公开接口

```
POST /user/register                用户注册
POST /user/login                   用户登录
POST /admin/user/register          管理员注册
POST /admin/user/login             管理员登录
GET  /article/all                  获取所有文章
GET  /article/find?aid=            按 ID 获取文章
GET  /article/title/:title         按标题搜索文章
GET  /announcement/list            获取已发布公告
POST /upload                       上传图片
```

### 用户接口（需 token）

```
POST /user/update                  更新用户信息
POST /user/writeOff                注销账户

GET  /data/find                    获取今日健康数据
POST /data/add                     记录今日健康数据（已有则更新）
POST /data/update                  更新指定记录
GET  /data/history?days=           获取最近 N 天历史数据
GET  /data/month?year=&month=      获取某月全部数据（日历视图）

GET  /plan/get                     获取健康计划
POST /plan/set                     设置健康计划

POST /workout/add                  新增运动记录
GET  /workout/list                 运动历史列表
GET  /workout/stats?range=         运动统计（week/month）
GET  /workout/:wid                 运动详情
DELETE /workout/:wid               删除运动记录

POST /checkin/do                   今日打卡（幂等）
GET  /checkin/calendar?year=&month= 获取月打卡记录
GET  /checkin/streak               获取连续打卡天数

GET  /habit/list                   习惯列表（含今日状态）
POST /habit/create                 创建习惯
POST /habit/:hid/check             习惯今日打卡（幂等）
DELETE /habit/:hid                 删除习惯

GET  /achievement/list             成就列表（自动检测解锁）
GET  /achievement/mine             已解锁成就

POST /mood/log                     记录今日心情（已有则更新）
GET  /mood/today                   获取今日心情
GET  /mood/history?days=           获取心情历史
```

### 管理员接口（需管理员 token）

```
GET    /admin/manage/stats                    系统统计
GET    /admin/manage/users                    用户列表（分页/搜索）
PUT    /admin/manage/users/:uid               更新用户
DELETE /admin/manage/users/:uid               删除用户
GET    /admin/manage/users/:uid/data          用户健康数据

GET    /admin/manage/articles                 文章列表
POST   /admin/manage/articles                 新增文章
PUT    /admin/manage/articles/:aid            编辑文章
DELETE /admin/manage/articles/:aid            删除文章

GET    /admin/manage/announcements            公告列表
POST   /admin/manage/announcements            新增公告
PUT    /admin/manage/announcements/:id        编辑公告
DELETE /admin/manage/announcements/:id        删除公告
```

---

## 算法说明

**BMI** = 体重(kg) ÷ 身高(m)²

**体脂率**（Deurenberg 公式）= `1.2 × BMI + 0.23 × 年龄 - 10.8 × 性别系数 - 5.4`（男=1，女=0）

**综合健康评分**（满分 100）= BMI 25分 + 卡路里达成率 20分 + 步数达成率 20分 + 运动达成率 20分 + 睡眠时长 15分

**打卡连续天数**：从最近一次打卡日期向前连续计算，当天未打卡不清零（只要最近一天已打卡即保持连续）

**成就解锁**：访问 `/achievement/list` 时惰性检查，自动解锁满足条件的成就

---

## 部署

```bash
# 构建用户端
cd app && npm run build:h5        # 输出 dist/build/h5-uni/

# 构建管理中台
cd admin && npm run build         # 输出 dist/

# PM2 启动后端（2 实例，每天 3 AM 重启）
cd server && pnpm run prod
```

---

## 环境依赖

| 依赖 | 版本要求 |
|---|---|
| Node.js | >= 18 |
| pnpm | >= 8（server） |
| npm | >= 8（app / admin） |
| 数据库 | Supabase PostgreSQL |

---

> 本项目为毕业设计项目，仅供学习交流使用。
