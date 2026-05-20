# admin — 管理中台

基于 Vue 3 + Vite + Element Plus 的后台管理系统，用于管理用户、文章及查看数据统计。

## 技术栈

| 依赖 | 说明 |
|---|---|
| Vue 3 | 核心框架 |
| Vite 5 | 构建工具 |
| Element Plus | UI 组件库 |
| TypeScript | 语言 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由 |
| Axios | HTTP 请求 |

## 启动

```bash
npm install
npm run dev        # 开发模式，访问 http://localhost:5173
npm run build      # 生产打包 → dist/
```

## 使用说明

### 创建管理员账号

首次使用需先注册管理员账号（后端启动后执行）：

```bash
curl -X POST http://localhost:2233/admin/user/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "account=admin&password=your_password"
```

### 登录

访问 `http://localhost:5173`，使用上述账号密码登录。

## 页面功能

| 页面 | 路由 | 功能 |
|---|---|---|
| 数据概览 | `/dashboard` | 注册用户数、文章数、健康记录数统计卡片 |
| 用户管理 | `/users` | 用户列表、搜索（账号/用户名）、分页、删除 |
| 文章管理 | `/articles` | 文章列表、搜索、新增、编辑（标题/内容/作者/类型）、删除 |

## API 代理

`vite.config.ts` 中配置代理：

```
/api  →  http://localhost:2233/   （后端服务）
```

## 目录结构

```
src/
├── api/            Axios 封装 + 所有接口函数
├── layouts/        主布局（侧边栏 + 顶部栏）
├── router/         路由配置（含登录守卫）
├── stores/         Pinia（auth：token + 管理员信息）
├── types/          TypeScript 类型定义
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── UsersView.vue
│   └── ArticlesView.vue
└── main.ts         应用入口（全局注册 Element Plus + 图标）
```
