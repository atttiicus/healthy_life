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
| 静态资源 | Nginx |

---

## 项目结构

```
healthy_life/
├── app/              用户端小程序（UniApp Vue 2，端口 8080）
├── server/           后端 API 服务（Koa2，端口 2233）
├── admin/            管理中台（Vue 3，端口 5173）
├── project/          Nginx 静态资源目录
├── start.sh          一键启动脚本
├── db_life.sql       数据库初始化脚本（参考用）
└── ai_docs/          项目文档与截图
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

也可通过 npm：

```bash
npm run dev    # 开发模式
npm run prod   # 生产模式
```

### 手动启动

```bash
# 后端（监听 :2233）
cd server && pnpm install && pnpm run dev

# 管理中台（监听 :5173）
cd admin && npm install && npm run dev

# 用户端（监听 :8080）
cd app && npm install && npm run dev:h5
```

> **启动顺序建议**：后端 → 管理中台 → 用户端

---

## 环境配置

### 后端 `.env`

```bash
cp server/.env.example server/.env
# 然后填写以下变量
```

| 变量 | 说明 | 示例 |
|---|---|---|
| `DB_NAME` | 数据库名 | `postgres` |
| `DB_USER` | 数据库用户 | `postgres.your_ref` |
| `DB_PASSWORD` | 数据库密码 | `your_password` |
| `DB_HOST` | 数据库主机 | `aws-0-ap-southeast-1.pooler.supabase.com` |
| `DB_PORT` | 数据库端口 | `5432` |
| `JWT_SECRET` | JWT 签名密钥 | 任意随机字符串 |
| `STATIC_UPLOAD_PATH` | 文件上传目录 | `E:/path/to/static` |
| `STATIC_BASE_URL` | 静态文件访问地址 | `http://localhost:9999/project/HL/static/` |

### Supabase 数据库

1. 前往 [supabase.com](https://supabase.com) 创建项目
2. 进入 **Settings → Database → Session pooler**，获取连接信息
3. 填入 `server/.env` 对应字段
4. 首次启动后端时 Sequelize 会自动建表（无需手动执行 SQL）

---

## 功能说明

### 用户端（app/）

| 页面 | 功能 |
|---|---|
| 主页 | 今日体重、**BMI / 体脂率自动计算**、卡路里进度环、步数/运动进度条、睡眠趋势折线图 |
| 生活空间 | 综合健康评分（环形图）、周/月/年报告切换、体重/运动/睡眠/饮食卡片 |
| 资讯 | 健康文章列表、关键词搜索 |
| 个人中心 | 用户信息、健康指标（体重/身高/血压/心率）、设置菜单 |
| 登录 / 注册 | 账号密码鉴权 |
| 数据更新弹窗 | 记录今日体重、卡路里、步数、运动时长、睡眠时长 |
| 编辑资料 | 修改用户名、密码、性别、年龄、身高体重等个人信息 |

### 管理中台（admin/）

访问 `http://localhost:5173`，需先注册管理员账号：

```bash
POST http://localhost:2233/admin/user/register
Body: { "account": "admin", "password": "your_password" }
```

| 页面 | 功能 |
|---|---|
| 数据概览 | 注册用户数、健康文章数、健康记录数 |
| 用户管理 | 用户列表（搜索/分页/删除） |
| 文章管理 | 文章列表（搜索/分页/新增/编辑/删除） |

### 后端接口

**公开接口**

```
POST /user/register            注册
POST /user/login               登录
GET  /article/all              获取所有文章
GET  /article/title/:keyword   按标题搜索
POST /admin/user/login         管理员登录
```

**用户接口（需 token）**

```
POST /user/update              更新用户信息
GET  /data/find?uid=           获取今日健康数据
GET  /data/add?uid=&...        添加今日健康数据
GET  /plan/get?uid=            获取健康计划
POST /plan/set                 设置健康计划
```

**管理员接口（需管理员 token）**

```
GET    /admin/manage/stats            数据统计
GET    /admin/manage/users            用户列表（支持分页/搜索）
DELETE /admin/manage/users/:uid       删除用户
GET    /admin/manage/articles         文章列表（支持分页/搜索）
POST   /admin/manage/articles         新增文章
PUT    /admin/manage/articles/:aid    编辑文章
DELETE /admin/manage/articles/:aid    删除文章
```

---

## 开发调试

### Mock 数据（无需后端）

用户端在 **后端未启动** 时自动启用 Mock，无需任何额外配置：

| 字段 | Mock 值 |
|---|---|
| 账号 | `18322223333` |
| 用户名 | Mock 用户 |
| 今日体重 | 65 kg |
| 身高 / 年龄 / 性别 | 175 cm / 25 岁 / 男 |
| 今日卡路里 | 1200 kcal |
| 今日步数 | 6800 步 |
| 健康计划 | 卡路里 2000 / 步数 10000 / 运动 40 min |

> Mock 仅在 `NODE_ENV=development` 下生效，生产构建自动关闭。  
> 若要使用真实账号，清除浏览器 LocalStorage 中的 `user_data` 键即可。

### BMI / 体脂率算法

- **BMI** = 体重(kg) ÷ 身高(m)²
- **体脂率** = Deurenberg 公式：`1.2 × BMI + 0.23 × 年龄 - 10.8 × 性别系数 - 5.4`
  - 性别系数：男 = 1，女 = 0

---

## 部署

```bash
# 构建用户端 → app/dist/build/h5-uni/
cd app && npm run build:h5

# 构建管理中台 → admin/dist/
cd admin && npm run build

# PM2 启动后端
cd server && pnpm run prod
```

将两个 `dist/` 目录部署到 Nginx，后端反向代理至 `:2233`。

### Nginx 静态资源参考配置

```nginx
server {
    listen       9999;
    server_name  localhost;
    charset      utf-8;
    autoindex    on;
    add_header   Cache-Control "no-cache, must-revalidate";

    location / {
        root html;
        add_header Access-Control-Allow-Origin *;
    }
}
```

---

## 环境依赖

| 依赖 | 要求 |
|---|---|
| Node.js | >= 18 |
| pnpm | >= 8（server 使用） |
| npm | >= 8（app / admin 使用） |
| 数据库 | Supabase PostgreSQL（无需本地安装） |

## 声明

本项目为毕业设计项目，仅作学习交流使用。
论文相关内容不予公开，请勿直接抄袭作为毕业设计使用。