import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

// path.resolve 基于文件实际位置，replace 确保 Windows 路径下 glob 能正确匹配
const routerGlob = path.resolve(__dirname, '../router/*.ts').replace(/\\/g, '/')

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: '健康生活 API',
      version: '1.0.0',
      description:
        '健康生活三端系统后端接口文档\n\n**认证：** 请求头传 `token` 字段（非 Authorization Bearer）\n\n**统一响应：** `{ code, data, message }`，成功 code=20000',
    },
    servers: [{ url: 'http://localhost:2233', description: '本地开发' }],
    components: {
      securitySchemes: {
        UserToken:  { type: 'apiKey', in: 'header', name: 'token', description: '用户 JWT token' },
        AdminToken: { type: 'apiKey', in: 'header', name: 'token', description: '管理员 JWT token' },
      },
      schemas: {
        ApiOk: {
          type: 'object',
          properties: {
            code:    { type: 'integer', example: 20000 },
            message: { type: 'string',  example: 'SUCCESS' },
            data:    { type: 'object' },
          },
        },
        UserInfo: { 
          type: 'object',
          properties: {
            uid:       { type: 'integer' },
            account:   { type: 'string' },
            user_name: { type: 'string' },
            email:     { type: 'string' },
            age:       { type: 'integer' },
            sex:       { type: 'string' },
            height:    { type: 'string' },
            weight:    { type: 'string' },
            token:     { type: 'string' },
          },
        },
        AdminUser: {
          type: 'object',
          properties: {
            id:      { type: 'integer' },
            account: { type: 'string' },
            avatar:  { type: 'string' },
            level:   { type: 'integer' },
            token:   { type: 'string' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            aid:        { type: 'integer' },
            type:       { type: 'integer', description: '0=原创 1=转载 2=未知' },
            title:      { type: 'string' },
            content:    { type: 'string' },
            author:     { type: 'string' },
            image:      { type: 'string' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        DayData: {
          type: 'object',
          properties: {
            did:          { type: 'integer' },
            uid:          { type: 'integer' },
            weight:       { type: 'string' },
            calorie:      { type: 'integer' },
            sleepTime:    { type: 'string', example: '07:30' },
            stepNum:      { type: 'integer' },
            exerciseTime: { type: 'string' },
            foods:        { type: 'string' },
            created_at:   { type: 'string', format: 'date-time' },
          },
        },
        Plan: {
          type: 'object',
          properties: {
            pid:           { type: 'integer' },
            uid:           { type: 'integer' },
            bloodPressure: { type: 'string', example: '120/80' },
            bmi:           { type: 'string' },
            weight:        { type: 'number' },
            heartRate:     { type: 'integer' },
            calorie:       { type: 'integer' },
            sleepTime:     { type: 'string', example: '07:30' },
            exerciseTime:  { type: 'integer' },
            step_target:   { type: 'integer', description: '目标步数（原 kilometre）' },
          },
        },
        Workout: {
          type: 'object',
          properties: {
            wid:        { type: 'integer' },
            uid:        { type: 'integer' },
            type:       { type: 'string', enum: ['running','cycling','gym','swimming','other'] },
            duration:   { type: 'integer', description: '分钟' },
            calories:   { type: 'integer' },
            notes:      { type: 'string' },
            started_at: { type: 'string', format: 'date', example: '2026-06-05' },
            detail: {
              type: 'object', nullable: true,
              properties: {
                distance:       { type: 'number', description: '公里' },
                avg_pace:       { type: 'string',  example: '06:30' },
                avg_heart_rate: { type: 'integer', description: 'bpm' },
              },
            },
          },
        },
      },
    },
  },
  apis: [routerGlob],
}

export const swaggerSpec = swaggerJsdoc(options)
