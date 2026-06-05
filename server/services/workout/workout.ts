import { Op } from 'sequelize'
import dayjs from 'dayjs'
import sequelize from '../../utils/pool'
import Workout from '../../models/workout'
import WorkoutRunDetail from '../../models/workoutRunDetail'
import DayData from '../../models/dayData'

const DISTANCE_TYPES = ['running', 'cycling']

type WorkoutParams = {
  type: string
  duration: number
  calories?: number
  notes?: string
  started_at: string
  distance?: number
  avg_pace?: string
  avg_heart_rate?: number
}

// 重算当天所有 workout 总时长并同步到 dayData.exerciseTime
async function syncExerciseTime(uid: number, date: string): Promise<void> {
  const total = ((await Workout.sum('duration', {
    where: { uid, started_at: date, is_del: 0 }
  })) as number) || 0

  const startDay = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endDay   = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss')

  const existing = await DayData.findOne({
    where: { uid, is_del: 0, created_at: { [Op.between]: [startDay, endDay] } }
  })

  if (existing) {
    await existing.update({ exerciseTime: String(total) })
  } else if (total > 0) {
    await DayData.create({ uid, exerciseTime: String(total) })
  }
}

export const createWorkoutService = async (uid: number, params: WorkoutParams) => {
  const { distance, avg_pace, avg_heart_rate, ...workoutParams } = params

  const workout = await Workout.create({ uid, ...workoutParams })
  const wid = workout.dataValues.wid as number

  if (DISTANCE_TYPES.includes(params.type) && (distance || avg_pace || avg_heart_rate)) {
    await WorkoutRunDetail.create({ wid, distance, avg_pace, avg_heart_rate })
  }

  await syncExerciseTime(uid, params.started_at)
  return workout
}

export const getWorkoutListService = async (
  uid: number,
  page = 1,
  limit = 10,
  type?: string
) => {
  const where: Record<string, unknown> = { uid, is_del: 0 }
  if (type) where.type = type

  const { count, rows } = await Workout.findAndCountAll({
    where,
    order: [['started_at', 'DESC'], ['created_at', 'DESC']],
    limit,
    offset: (page - 1) * limit,
    attributes: { exclude: ['is_del'] }
  })

  const wids = rows.map(r => r.dataValues.wid as number)
  const details = wids.length
    ? await WorkoutRunDetail.findAll({ where: { wid: wids } })
    : []
  const detailMap = Object.fromEntries(
    details.map(d => [String(d.dataValues.wid), d.dataValues])
  )

  return {
    total: count,
    list: rows.map(r => ({
      ...r.dataValues,
      detail: detailMap[String(r.dataValues.wid)] || null
    }))
  }
}

export const getWorkoutByIdService = async (wid: number, uid: number) => {
  const workout = await Workout.findOne({
    where: { wid, uid, is_del: 0 },
    attributes: { exclude: ['is_del'] }
  })
  if (!workout) return null

  const detail = await WorkoutRunDetail.findOne({ where: { wid } })
  return { ...workout.dataValues, detail: detail?.dataValues || null }
}

export const deleteWorkoutService = async (wid: number, uid: number) => {
  const workout = await Workout.findOne({ where: { wid, uid, is_del: 0 } })
  if (!workout) return null

  const date = workout.dataValues.started_at as string
  await workout.update({ is_del: 1 })
  await syncExerciseTime(uid, date)
  return workout
}

export const getWorkoutStatsService = async (uid: number, range: 'week' | 'month') => {
  const days  = range === 'week' ? 7 : 30
  const start = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD')
  const end   = dayjs().format('YYYY-MM-DD')

  return Workout.findAll({
    where: { uid, is_del: 0, started_at: { [Op.between]: [start, end] } },
    attributes: [
      'type',
      [sequelize.fn('SUM', sequelize.col('duration')), 'total_duration'],
      [sequelize.fn('SUM', sequelize.col('calories')),  'total_calories'],
      [sequelize.fn('COUNT', sequelize.col('wid')),     'count'],
    ],
    group: ['type'],
    raw: true
  })
}
