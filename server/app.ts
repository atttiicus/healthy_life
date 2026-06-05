import 'dotenv/config'
import http from "http"
import Koa from "koa"
import koaStatic from 'koa-static'
import { loggerMiddleware } from './log/log'
import koaBody from 'koa-body'
import { errorHandler, responseHandler } from './middleware/response'
import { FIXED_KEY, NGINX_STATIC_PATH} from './config/constant'
import { getIPAddress } from './utils/util'
import { privateRouter, publicRouter, adminPrivateRouter } from './router'
import fs from 'fs';

const app = new Koa()

const uploadDir = NGINX_STATIC_PATH.uploadPath;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 静态文件服务：上传的图片直接通过后端返回，访问路径 /static/<filename>
app.use(async (ctx, next) => {
  if (!ctx.path.startsWith('/static/')) return next()
  ctx.path = ctx.path.slice('/static'.length)
  return koaStatic(uploadDir)(ctx, next)
})

app.use(loggerMiddleware)

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, token')
  ctx.set('Access-Control-Max-Age', '86400')
  if (ctx.method === 'OPTIONS') { ctx.status = 204; return }
  return next()
})

app.use(errorHandler)
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: uploadDir,
    keepExtensions: true,
  }
}))

app.use(publicRouter.routes()).use(publicRouter.allowedMethods())
app.use(privateRouter.routes()).use(privateRouter.allowedMethods())
app.use(adminPrivateRouter.routes()).use(adminPrivateRouter.allowedMethods())

app.use(responseHandler)

const port = FIXED_KEY.port
const server = http.createServer(app.callback())
server.listen(port)

server.on("error", (err) => {
  console.error(err)
})

server.on("listening", () => {
  const ip = getIPAddress()
  const address = `http://${ip}:${port}`
  const localAddress = `http://localhost:${port}`
  console.log(`app started at address \n\n${localAddress} \n\n${address}`)
})
