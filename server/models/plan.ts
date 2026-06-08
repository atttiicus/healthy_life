import { DataTypes, Model } from 'sequelize'
import sequelize from '../utils/pool'

class Plan extends Model { }

Plan.init({
    pid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: "目标计划 主键id"
    },
    uid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "目标计划 对应UID"
    },
    bloodPressure: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 血压"
    },
    bmi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 BMI",
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 体重（kg）",
    },
    heartRate: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 心率（bpm）",
    },
    calorie: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 卡路里（kcal）",
    },
    sleepTime: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 睡眠时间（HH:MM）",
    },
    exerciseTime: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "目标计划 锻炼时间（min）",
    },
    step_target: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "目标计划 步数目标（原 kilometre）",
    },
    is_del: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "0:未删除, 1:已删除"
    }
},{
    sequelize,
    modelName: "plan",
    freezeTableName: true,
    indexes: [
        { fields: ['uid'] },
    ],
})

export default Plan