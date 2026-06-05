import {Context, Next} from "koa";
import {CODE} from "../../config/code";
import {getUserInfosService} from "../../services/user/user";
import { addPlanDataByUid, getPlanDataByUid, updatePlanDataByUid } from '../../services/plan/plan'

/**
 * @description 获取用户的健康计划数据
 * */
export const getPlanDataApi = async (ctx: Context, next: Next) => {
    const uid = ctx.userId

    const resultUser = await getUserInfosService(uid)
    if (!resultUser) throw CODE.userNotExist

    const result = await getPlanDataByUid(uid)
    ctx.body = result?.dataValues
    return next()
}

export const setPlanDataApi = async (ctx: Context, next: Next) => {
    const uid = ctx.userId
    const params = ctx.request.body

    const userExists = await getUserInfosService(uid)
    if (!userExists) throw CODE.userNotExist

    const existing = await getPlanDataByUid(uid)
    if (!existing) {
        const createResult = await addPlanDataByUid(uid, { ...params })
        if (!createResult) throw CODE.planAddError
        ctx.body = createResult.dataValues
    } else {
        const updateResult = await updatePlanDataByUid(uid, { ...params })
        if (!updateResult) throw CODE.planUpdateError
        ctx.body = updateResult
    }

    return next()
}