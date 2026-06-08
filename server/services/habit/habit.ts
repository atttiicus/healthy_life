import dayjs from 'dayjs'
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

  return Promise.all(habits.map(async (habit) => {
    const hid = habit.dataValues.hid as number
    const [checkedToday, totalDays] = await Promise.all([
      HabitLog.findOne({ where: { hid, log_date: today, is_del: 0 } }),
      HabitLog.count({ where: { hid, is_del: 0 } }),
    ])
    return { ...habit.dataValues, checked_today: !!checkedToday, total_days: totalDays }
  }))
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
