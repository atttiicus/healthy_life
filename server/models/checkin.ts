import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class Checkin extends Model {}

Checkin.init({
  cid: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '打卡主键'
  },
  uid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联用户ID'
  },
  checkin_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '打卡日期 YYYY-MM-DD'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '打卡备注'
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除, 1:已删除'
  }
}, {
  sequelize,
  modelName: 'checkin',
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['uid', 'checkin_date'] }]
})

export default Checkin
