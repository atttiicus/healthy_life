# 健康生活 Healthy Life

一个基于 UniApp + Vue 2 的健康管理小程序，配套 Koa2 后端服务和 Vue 3 管理中台。

---

## 技术栈

| 模块 | 技术 |
|---|---|
| 用户端小程序 | UniApp · Vue 2 · Vant · ECharts · UnoCSS |
| 管理中台 | Vue 3 · Vite · Element Plus · TypeScript · Pinia |
| 后端服务 | Node.js 18 · Koa2 · TypeScript · Sequelize |
| 数据库 | PostgreSQL（Supabase 云托管） |

---

## 项目结构

```
healthy_life/
├── app/        用户端小程序（UniApp Vue 2，端口 8080）
├── server/     后端 API 服务（Koa2，端口 2233）
├── admin/      管理中台（Vue 3，端口 5173）
├── start.sh    一键启动脚本
└── ai_docs/    项目文档
```

---

## 快速启动

### 一键启动（推荐）

```bash
# 开发模式：并发启动后端 + 管理中台 + 用户端
bash start.sh dev

# 生产模式：构建前端 + PM2 启动后端
bash start.sh prod
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

> 建议启动顺序：后端 → 管理中台 → 用户端

---

## 环境配置

### 后端 `.env`

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
| `STATIC_BASE_URL` | 静态文件访问地址（`http://localhost:2233/static/`） |

### Supabase 数据库

1. 前往 [supabase.com](https://supabase.com) 创建项目
2. 进入 **Settings → Database → Session pooler** 获取连接信息
3. 填入 `server/.env`
4. 首次启动后端时 Sequelize 自动建表，无需手动执行 SQL

---

## 功能说明

### 用户端

| 页面 | 功能 |
|---|---|
| 主页 | 今日体重、BMI / 体脂率计算、卡路里进度环、步数 / 运动进度、睡眠趋势图、个性化健康建议 |
| 生活空间 | 综合健康评分（动态计算）、周 / 月 / 年报告切换、健康数据进度卡片 |
| 资讯 | 健康文章列表、关键词搜索 |
| 个人中心 | 用户信息、体重 / 身高 / 血压 / 心率指标展示 |
| 登录 / 注册 | 账号密码鉴权，密码 bcrypt 加密存储 |
| 数据更新 | 记录今日体重、早 / 中 / 晚三餐饮食、卡路里、步数、运动时长、睡眠 |
| 编辑资料 | 修改用户名、密码、性别、年龄、身高体重 |

### 管理中台

访问 `http://localhost:5173`。首次使用需注册管理员账号：

```
POST http://localhost:2233/admin/user/register
{ "account": "admin", "password": "your_password" }
```

| 页面 | 功能 |
|---|---|
| 数据概览 | 用户数、文章数、健康记录数统计 |
| 用户管理 | 列表、搜索、分页、删除 |
| 文章管理 | 列表、搜索、新增、编辑、删除 |

### 后端接口

**公开接口**

```
POST /user/register              注册
POST /user/login                 登录
GET  /article/all                获取所有文章
GET  /article/title/:keyword     按标题搜索文章
GET  /static/:filename           静态图片访问
POST /admin/user/register        管理员注册
POST /admin/user/login           管理员登录
```

**用户接口（需 JWT token）**

```
POST /user/update                更新用户信息
GET  /data/find?uid=             获取今日健康数据
GET  /data/add?uid=&...          添加今日健康数据
GET  /data/history?uid=&days=    获取历史健康数据（趋势图）
GET  /plan/get?uid=              获取健康计划
POST /plan/set                   设置健康计划
```

**管理员接口（需管理员 token）**

```
GET    /admin/manage/stats              数据统计
GET    /admin/manage/users              用户列表
DELETE /admin/manage/users/:uid         删除用户
GET    /admin/manage/articles           文章列表
POST   /admin/manage/articles           新增文章
PUT    /admin/manage/articles/:aid      编辑文章
DELETE /admin/manage/articles/:aid      删除文章
```

---

## 算法说明

**BMI** = 体重(kg) ÷ 身高(m)²

**体脂率**（Deurenberg 公式）= `1.2 × BMI + 0.23 × 年龄 - 10.8 × 性别系数 - 5.4`（男=1，女=0）

**综合健康评分**（满分 100）= BMI 25 分 + 卡路里达成率 20 分 + 步数达成率 20 分 + 运动达成率 20 分 + 睡眠时长 15 分

---

## 部署

```bash
# 构建用户端
cd app && npm run build:h5

# 构建管理中台
cd admin && npm run build

# PM2 启动后端
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
