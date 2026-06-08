import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class HabitLog extends Model {}

HabitLog.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  hid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联习惯ID',
  },
  uid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联用户ID',
  },
  log_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '打卡日期 YYYY-MM-DD',
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除 1:已删除',
  },
}, {
  sequelize,
  modelName: 'habit_log',
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['hid', 'log_date'] }],
})

export default HabitLog
