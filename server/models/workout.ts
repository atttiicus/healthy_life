import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class Workout extends Model {}

Workout.init({
  wid: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '运动记录主键'
  },
  uid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联用户ID'
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'running | cycling | gym | swimming | other'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '运动时长（分钟）'
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '消耗卡路里'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  },
  started_at: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '运动日期 YYYY-MM-DD'
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除, 1:已删除'
  }
}, {
  sequelize,
  modelName: 'workout',
  freezeTableName: true
})

export default Workout
