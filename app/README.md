# app — 用户端小程序

基于 UniApp + Vue 2 的健康生活小程序，支持 H5 / 微信小程序等多端编译。

## 技术栈

| 依赖 | 说明 |
|---|---|
| UniApp | 多端编译框架 |
| Vue 2 | 核心框架 |
| Vant 2 | 移动端 UI 组件库 |
| ECharts | 图表（睡眠趋势折线图） |
| UnoCSS | 原子化 CSS（PostCSS 模式接入） |
| Vuex 3 | 状态管理 |
| dayjs | 日期处理 |

## 启动

```bash
npm install
npm run dev:h5        # H5 开发模式，访问 http://localhost:8080
npm run build:h5      # H5 生产打包 → dist/build/h5-uni/
```

## 页面说明

| 页面 | 路径 | 功能 |
|---|---|---|
| 主页 | `pages/index` | 体重卡、BMI/体脂率、卡路里进度、步数/运动、睡眠趋势图 |
| 生活空间 | `pages/life` | 综合评分、周/月/年报表、睡眠折线图 |
| 资讯 | `pages/article` | 文章列表、关键词搜索 |
| 文章详情 | `pages/article/content` | iframe 展示原文 |
| 个人中心 | `pages/user` | 用户信息、健康指标、设置 |
| 登录 / 注册 | `pages/user/login` `register` | 账号密码鉴权 |
| 编辑资料 | `pages/user/update` | 修改用户名、密码、身高体重等 |

## API 代理（H5 开发）

`manifest.json` 中配置了两条代理：

```
/api  →  http://localhost:2233/   （后端服务）
```

## 目录结构

```
src/
├── pages/          页面
├── components/     公共组件（数据更新弹窗等）
├── store/          Vuex 状态（user / currentData / userPlanData / articles）
├── styles/         UnoCSS 入口（uno.css）
├── static/         静态资源（图片、图标）
└── main.js         应用入口
```
