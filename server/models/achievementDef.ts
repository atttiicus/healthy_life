import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class AchievementDef extends Model {}

AchievementDef.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '成就唯一标识',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '成就名称',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '成就描述',
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'star-o',
    comment: 'Vant 图标名',
  },
  condition_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'checkin_count | checkin_streak | workout_count | habit_count | habit_max_days',
  },
  condition_value: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '触发阈值',
  },
}, {
  sequelize,
  modelName: 'achievement_def',
  freezeTableName: true,
  timestamps: false,
  indexes: [{ unique: true, fields: ['code'] }],
})

export default AchievementDef
