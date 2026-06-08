import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class MoodLog extends Model {}

MoodLog.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联用户ID',
  },
  mood: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: '心情值 1~5，1=很差 5=很好',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '心情备注',
  },
  log_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '记录日期 YYYY-MM-DD',
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除 1:已删除',
  },
}, {
  sequelize,
  modelName: 'mood_log',
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['uid', 'log_date'] }],
})

export default MoodLog
