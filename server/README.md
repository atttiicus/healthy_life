# server — 后端 API 服务

基于 Koa2 + TypeScript 的 RESTful API 服务，数据库使用 Supabase（PostgreSQL）。

## 技术栈

| 依赖 | 说明 |
|---|---|
| Koa2 | Web 框架 |
| TypeScript | 语言 |
| Sequelize 6 | ORM（PostgreSQL dialect） |
| jsonwebtoken | JWT 认证 |
| bcryptjs | 密码哈希（纯 JS，无原生依赖）|
| koa-static | 静态文件服务（上传图片） |
| log4js | 日志 |
| PM2 | 生产进程管理 |

## 启动

```bash
# 安装依赖
pnpm install

# 开发模式（nodemon 热更新）
pnpm run dev

# 生产模式（PM2）
pnpm run prod
pnpm run stop    # 停止
pnpm run list    # 查看进程
```

启动成功标志：控制台输出 `Connection has been established successfully`

## 环境变量

复制模板并填写：

```bash
cp .env.example .env
```

| 变量 | 说明 |
|---|---|
| `DB_*` | Supabase PostgreSQL 连接信息 |
| `JWT_SECRET` | JWT 签名密钥 |
| `STATIC_UPLOAD_PATH` | 上传文件保存目录 |
| `STATIC_BASE_URL` | 静态文件访问地址（`http://localhost:2233/static/`）|

## 接口列表

**公开接口**

```
POST /user/register              注册
POST /user/login                 登录
GET  /article/all                获取所有文章
GET  /article/title/:keyword     按标题搜索
POST /admin/user/login           管理员登录
POST /upload                     文件上传
GET  /static/:filename           静态图片访问
```

**用户接口（需 token）**

```
POST /user/update                更新用户信息
GET  /data/find?uid=             获取今日健康数据
GET  /data/add?uid=&...          添加今日健康数据
GET  /plan/get?uid=              获取健康计划
POST /plan/set                   设置健康计划
```

**管理员接口（需管理员 token）**

```
GET    /admin/manage/stats            数据统计
GET    /admin/manage/users            用户列表
DELETE /admin/manage/users/:uid       删除用户
GET    /admin/manage/articles         文章列表
POST   /admin/manage/articles         新增文章
PUT    /admin/manage/articles/:aid    编辑文章
DELETE /admin/manage/articles/:aid    删除文章
```

## 目录结构

```
server/
├── config/         常量配置（端口、错误码）
├── controller/     控制器（业务入口）
│   ├── admin/      管理员相关
│   ├── article/    文章
│   ├── daydata/    每日健康数据
│   ├── plan/       健康计划
│   ├── user/       普通用户
│   └── utils/      工具（文件上传）
├── middleware/     中间件（JWT 验证、响应封装）
├── models/         Sequelize 数据模型
├── router/         路由（public / private / adminPrivate）
├── services/       Service 层（数据库操作）
├── types/          TypeScript 类型扩展
├── utils/          工具函数（JWT、IP 获取）
└── app.ts          服务入口
```

## 数据库

使用 Supabase 云 PostgreSQL，首次启动会自动建表（Sequelize sync）。

数据表：`normaluser` / `adminuser` / `article` / `daydata` / `plan`
