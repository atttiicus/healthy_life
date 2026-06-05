import DayData from '../../models/dayData'
import dayjs from "dayjs";
import {Op} from "sequelize";

type healthParams = {
  calorie?: number,
  sleepTime?: string,
  exerciseTime?: string,
  foods?: string,
  stepNum?: string,
  weight?:string,
}

/**
 * 通过 uid 查询该用户的当日数据
 * @param uid {number} 用户id
 * @return 日数据
 * */
export const getDayDataService = (uid: string | string[]) => {
  let startDay= dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss')
  let endDay = dayjs().endOf('date').format('YYYY-MM-DD HH:mm:ss')
  return DayData.findOne({
    where: {
      uid: uid,
      is_del: 0,
      created_at: { [Op.between] : [startDay, endDay]}
    },
    attributes: {exclude:["password","is_del"]}
  })
}

/**
 * 通过 uid 指定 time 查询用户某日的数据
 * @param uid {number} 用户id
 * @param time {Date} 时间
 * @return 日数据
 * */
export const getUserDayDataByTimeService = (uid: number, time: Date) => {
  return DayData.findOne({where: {uid: uid, created_at: time, is_del: 0}})
}

/**
 * 当日已有记录则更新，否则新建（upsert 语义）
 * */
export const createDayDataService = async (uid: number, params: healthParams) => {
  const startDay = dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss')
  const endDay   = dayjs().endOf('date').format('YYYY-MM-DD HH:mm:ss')
  const existing = await DayData.findOne({
    where: { uid, is_del: 0, created_at: { [Op.between]: [startDay, endDay] } }
  })
  if (existing) {
    await existing.update(params)
    return existing
  }
  return DayData.create({ uid, ...params })
}

/**
 * 传入 did 与 需要更新的健康参数 修改日数据
 * @param did {number} 数据id
 * @param params {updateParams} 健康参数
 * @return 数据库修改信息
 * */
export const updateDayDataService = (did: string | string[], params: healthParams) => {
  return DayData.update(params, {where: {did: did, is_del: 0}})
}

/**
 * 查询用户最近 N 天的健康数据（每天一条，按日期升序）
 * @param uid {number} 用户id
 * @param days {number} 天数，默认 7
 * @return 日数据数组
 */
export const getDayDataHistoryService = (uid: number, days = 7) => {
  const start = dayjs().subtract(days - 1, 'day').startOf('date').format('YYYY-MM-DD HH:mm:ss')
  const end   = dayjs().endOf('date').format('YYYY-MM-DD HH:mm:ss')
  return DayData.findAll({
    where: { uid, is_del: 0, created_at: { [Op.between]: [start, end] } },
    attributes: { exclude: ['is_del'] },
    order: [['created_at', 'ASC']],
  })
}

/**
 * 传入 did 删除对应日数据
 * @param did {number} 数据id
 * @return 数据库修改信息
 * */
export const deleteDayDataService = (did: number) => {
  return DayData.update({is_del: 1}, {where: {did: did, is_del: 0}})
}