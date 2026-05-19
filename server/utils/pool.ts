import { DATABASE, ENV } from '../config/constant'
import { Sequelize } from 'sequelize'

const { dbName, user, password, host, port } =
  process.env.NODE_ENV === ENV.production ? DATABASE.production : DATABASE.development

const isProduction = process.env.NODE_ENV === ENV.production

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "postgres",
  host: host,
  port: port,
  timezone: "+08:00",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    underscored: true,
  }
})

// alter:true 仅在开发环境使用，生产环境关闭以防止意外修改表结构
sequelize.sync({ force: false, alter: !isProduction })

sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully")
  }).catch((err: Error) => {
    console.error(err.message)
  })

export default sequelize
