import { Op } from 'sequelize'
import dayjs from 'dayjs'
import MoodLog from '../../models/moodLog'

export const logMoodService = async (uid: number, mood: number, note?: string) => {
  const today = dayjs().format('YYYY-MM-DD')
  const existing = await MoodLog.findOne({ where: { uid, log_date: today, is_del: 0 } })
  if (existing) {
    await existing.update({ mood, note })
    return existing
  }
  return MoodLog.create({ uid, mood, note, log_date: today })
}

export const getTodayMoodService = (uid: number) => {
  const today = dayjs().format('YYYY-MM-DD')
  return MoodLog.findOne({
    where: { uid, log_date: today, is_del: 0 },
    attributes: { exclude: ['is_del'] },
  })
}

export const getMoodHistoryService = (uid: number, days = 30) => {
  const start = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD')
  const end   = dayjs().format('YYYY-MM-DD')
  return MoodLog.findAll({
    where: { uid, is_del: 0, log_date: { [Op.between]: [start, end] } },
    attributes: { exclude: ['is_del'] },
    order: [['log_date', 'DESC']],
  })
}
