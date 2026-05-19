import os from 'os'
import jwt from 'jsonwebtoken'
import { JWT } from '../config/constant'

export const getIPAddress = (): string => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const temp = interfaces[devName]
    if (!temp) continue
    for (let i = 0; i < temp.length; i++) {
      const alias = temp[i]
      if (alias.family === "IPv4" && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
  return "127.0.0.1"
}

export const getClientIPAddress = (ctx: { headers: Record<string, string | string[] | undefined> }): string => {
  const forwarded = ctx.headers["x-forwarded-for"]
  if (forwarded) {
    return String(forwarded).split(",")[0].trim()
  }
  return "0.0.0.0"
}

export const generatorToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT.secret, { expiresIn: JWT.expires })
}

export const verifyJWTToken = (token: string, secret: string): jwt.JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded as jwt.JwtPayload
  } catch (err) {
    throw new Error("token不合法")
  }
}
