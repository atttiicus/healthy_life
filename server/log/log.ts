import log4js from 'log4js'
import Koa from 'koa'
import { getClientIPAddress } from '../utils/util'

log4js.configure({
  pm2: true,
  appenders: {
    file: {
      type: 'dateFile',
      filename: __dirname + '/logs/all-the-logs.log',
      maxLogSize: '10M',
      backups: 20,
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders: ['file', 'console'],
      level: 'debug',
    },
  },
})

export const logger = log4js.getLogger()

// ANSI 颜色
const c = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
  bold:   '\x1b[1m',
}

function statusColor(status: number): string {
  if (status >= 500) return c.red
  if (status >= 400) return c.yellow
  if (status >= 300) return c.cyan
  return c.green
}

function methodColor(method: string): string {
  const map: Record<string, string> = {
    GET:    c.green,
    POST:   c.cyan,
    PUT:    c.yellow,
    DELETE: c.red,
    PATCH:  c.yellow,
  }
  return map[method] || c.gray
}

export const loggerMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start

  const method = ctx.method
  const status = ctx.status
  const path   = ctx.path
  const ip     = getClientIPAddress(ctx)

  // 控制台彩色输出
  const line = [
    `${c.gray}${new Date().toLocaleTimeString('zh-CN', { hour12: false })}${c.reset}`,
    `${methodColor(method)}${c.bold}${method.padEnd(7)}${c.reset}`,
    `${statusColor(status)}${status}${c.reset}`,
    path,
    `${c.gray}${ms}ms${c.reset}`,
    ip !== '0.0.0.0' ? `${c.gray}[${ip}]${c.reset}` : '',
  ].filter(Boolean).join('  ')

  console.log(line)

  // 文件日志（保留原始结构化内容）
  logger.info(
    `${method} ${status} ${path} - ${ms}ms - ${ip} | body: ${JSON.stringify(ctx.request.body)}`
  )
}
