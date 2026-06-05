import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class WorkoutRunDetail extends Model {}

WorkoutRunDetail.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  wid: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '关联 workout.wid (1:1)'
  },
  distance: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: '距离（公里）'
  },
  avg_pace: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '平均配速 mm:ss/km'
  },
  avg_heart_rate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '平均心率（bpm）'
  }
}, {
  sequelize,
  modelName: 'workout_run_detail',
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['wid'] }]
})

export default WorkoutRunDetail
