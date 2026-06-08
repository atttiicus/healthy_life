import {Context, Next} from "koa";
import {CODE} from "../../config/code";
import { createDayDataService, getDayDataService, getDayDataHistoryService, updateDayDataService, getDayDataByMonthService } from '../../services/data/data'

/**
 * 添加一条每日数据, 需要传入用户的id, 和收集的数据
 * 注意数据可以不完整, 但不允许一个有效数据都没有
 * 添加完成后会返回该条数据
 * */
export const addDayData = async (ctx: Context, next: Next) => {
    const uid = ctx.userId
    const params = ctx.request.body
    if (JSON.stringify(params) === "{}") throw CODE.missingParameters

    const result = await createDayDataService(uid, params)
    ctx.body = result?.dataValues

    return next()
}

export const getCurrentDayData = async (ctx: Context, next: Next) => {
    const uid = ctx.userId
    const result = await getDayDataService(String(uid))
    ctx.body = result?.dataValues

    return next()
}

export const updateCurrentDayData = async (ctx: Context, next: Next) => {
    const { did, ...params } = ctx.request.body
    if (!did) throw CODE.needMissingParameters
    if (isNaN(Number(did))) throw CODE.errorTypeParameters

    const result = await updateDayDataService(did, params)
    ctx.body = { result }

    return next()
}

export const getDayDataHistory = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const { days } = ctx.request.query

  const list = await getDayDataHistoryService(uid, Number(days) || 7)
  ctx.body = list.map(r => r.dataValues)
  return next()
}

export const getDayDataByMonth = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const { year, month } = ctx.request.query
  if (!year || !month) throw CODE.missingParameters

  const list = await getDayDataByMonthService(uid, Number(year), Number(month))
  ctx.body = list.map(r => r.dataValues)
  return next()
}