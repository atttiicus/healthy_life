import dayjs from 'dayjs'
import { fn, col } from 'sequelize'
import Habit from '../../models/habit'
import HabitLog from '../../models/habitLog'

export const createHabitService = (uid: number, params: {
  title: string
  icon?: string
  target_days?: number
}) => {
  return Habit.create({ uid, icon: 'star-o', target_days: 21, ...params })
}

export const getHabitListService = async (uid: number) => {
  const today = dayjs().format('YYYY-MM-DD')

  const habits = await Habit.findAll({
    where: { uid, is_active: true, is_del: 0 },
    order: [['created_at', 'ASC']],
  })

  if (!habits.length) return []

  const hids = habits.map(h => h.dataValues.hid as number)

  const [todayLogs, countRows] = await Promise.all([
    HabitLog.findAll({
      where: { hid: hids, log_date: today, is_del: 0 },
      attributes: ['hid'],
    }),
    HabitLog.findAll({
      where: { hid: hids, is_del: 0 },
      attributes: ['hid', [fn('COUNT', col('hid')), 'count']],
      group: ['hid'],
      raw: true,
    }),
  ])

  const checkedSet = new Set(todayLogs.map(l => l.dataValues.hid as number))
  const countMap = new Map((countRows as unknown as { hid: number; count: string }[]).map(r => [r.hid, Number(r.count)]))

  return habits.map(habit => {
    const hid = habit.dataValues.hid as number
    return {
      ...habit.dataValues,
      checked_today: checkedSet.has(hid),
      total_days: countMap.get(hid) ?? 0,
    }
  })
}

export const checkHabitService = async (uid: number, hid: number) => {
  const habit = await Habit.findOne({ where: { hid, uid, is_del: 0 } })
  if (!habit) return null

  const today = dayjs().format('YYYY-MM-DD')
  const existing = await HabitLog.findOne({ where: { hid, log_date: today, is_del: 0 } })
  if (existing) return existing

  return HabitLog.create({ hid, uid, log_date: today })
}

export const deleteHabitService = async (uid: number, hid: number) => {
  const habit = await Habit.findOne({ where: { hid, uid, is_del: 0 } })
  if (!habit) return null
  await Habit.update({ is_del: 1 }, { where: { hid, uid } })
  return true
}
