import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class UserAchievement extends Model {}

UserAchievement.init({
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
  ach_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联成就定义ID',
  },
  unlocked_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '解锁时间',
  },
}, {
  sequelize,
  modelName: 'user_achievement',
  freezeTableName: true,
  timestamps: false,
  indexes: [{ unique: true, fields: ['uid', 'ach_id'] }],
})

export default UserAchievement
