import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class Habit extends Model {}

Habit.init({
  hid: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联用户ID',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '习惯名称',
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'star-o',
    comment: 'Vant 图标名',
  },
  target_days: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 21,
    comment: '目标坚持天数',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否激活',
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除 1:已删除',
  },
}, {
  sequelize,
  modelName: 'habit',
  freezeTableName: true,
})

export default Habit
