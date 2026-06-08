import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class Announcement extends Model {}

Announcement.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '公告标题',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '公告内容',
  },
  tag: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'NEW',
    comment: 'NEW | FIX | INFO',
  },
  author: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '管理员',
    comment: '发布者',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '是否发布',
  },
  is_del: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0:未删除 1:已删除',
  },
}, {
  sequelize,
  modelName: 'announcement',
  freezeTableName: true,
})

export default Announcement
