import 'dotenv/config'
import http from "http"
import Koa from "koa"
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

app.use(loggerMiddleware)
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
