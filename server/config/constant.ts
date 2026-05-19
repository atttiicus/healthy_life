// 环境参数
export const ENV = {
  development: "development",
  production: "production"
}

// 固定端口参数
export const FIXED_KEY = {
  port: Number(process.env.PORT) || 2233
}

export const DATABASE = {
  development: {
    dbName: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432
  },
  production: {
    dbName: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432
  }
}

// JWT token配置参数
export const JWT = {
  secret: process.env.JWT_SECRET || "change_this_secret",
  expires: 60 * 60 * 24 * 30 // 30day
}

export const NGINX_STATIC_PATH = {
  uploadPath: process.env.STATIC_UPLOAD_PATH || "./uploads",
}

export const STATIC_BASE_URL = process.env.STATIC_BASE_URL || "http://localhost:9999/project/HL/static/"
