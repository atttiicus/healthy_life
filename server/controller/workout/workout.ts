import { Context, Next } from 'koa'
import { CODE } from '../../config/code'
import {
  createWorkoutService,
  deleteWorkoutService,
  getWorkoutByIdService,
  getWorkoutListService,
  getWorkoutStatsService,
} from '../../services/workout/workout'

const VALID_TYPES = ['running', 'cycling', 'gym', 'swimming', 'other']

export const addWorkout = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const { type, duration, calories, notes, started_at, distance, avg_pace, avg_heart_rate } =
    ctx.request.body

  if (!type || !VALID_TYPES.includes(type))  throw CODE.errorTypeParameters
  if (!duration || Number(duration) <= 0)    throw CODE.missingParameters
  if (!started_at)                           throw CODE.missingParameters

  const result = await createWorkoutService(uid, {
    type,
    duration:       Number(duration),
    calories:       calories       ? Number(calories)       : undefined,
    notes,
    started_at,
    distance:       distance       ? Number(distance)       : undefined,
    avg_pace,
    avg_heart_rate: avg_heart_rate ? Number(avg_heart_rate) : undefined,
  })

  ctx.body = result.dataValues
  return next()
}

export const getWorkoutList = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const { page, limit, type } = ctx.request.query

  ctx.body = await getWorkoutListService(
    uid,
    page  ? Number(page)  : 1,
    limit ? Number(limit) : 10,
    type as string | undefined
  )
  return next()
}

export const getWorkoutDetail = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const wid = Number(ctx.params.wid)
  if (isNaN(wid)) throw CODE.errorTypeParameters

  const result = await getWorkoutByIdService(wid, uid)
  if (!result) throw CODE.workoutNotFound

  ctx.body = result
  return next()
}

export const deleteWorkout = async (ctx: Context, next: Next) => {
  const uid = ctx.userId
  const wid = Number(ctx.params.wid)
  if (isNaN(wid)) throw CODE.errorTypeParameters

  const result = await deleteWorkoutService(wid, uid)
  if (!result) throw CODE.workoutNotFound

  ctx.body = { deleted: true }
  return next()
}

export const getWorkoutStats = async (ctx: Context, next: Next) => {
  const uid   = ctx.userId
  const range = ctx.request.query.range === 'month' ? 'month' : 'week'

  ctx.body = await getWorkoutStatsService(uid, range)
  return next()
}
