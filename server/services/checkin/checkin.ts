import { Op } from 'sequelize'
import dayjs from 'dayjs'
import Checkin from '../../models/checkin'

export const doCheckinService = async (uid: number, note?: string) => {
  const today = dayjs().format('YYYY-MM-DD')

  const existing = await Checkin.findOne({
    where: { uid, checkin_date: today, is_del: 0 }
  })
  if (existing) return existing

  return Checkin.create({ uid, checkin_date: today, note })
}

export const getCalendarService = async (
  uid: number,
  year: number,
  month: number
): Promise<string[]> => {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const start  = dayjs(`${prefix}-01`).startOf('month').format('YYYY-MM-DD')
  const end    = dayjs(`${prefix}-01`).endOf('month').format('YYYY-MM-DD')

  const records = await Checkin.findAll({
    where: { uid, is_del: 0, checkin_date: { [Op.between]: [start, end] } },
    attributes: ['checkin_date'],
    order: [['checkin_date', 'ASC']],
  })

  return records.map(r => r.dataValues.checkin_date as string)
}

export const getStreakService = async (uid: number) => {
  const records = await Checkin.findAll({
    where: { uid, is_del: 0 },
    attributes: ['checkin_date'],
    order: [['checkin_date', 'DESC']],
    limit: 365,
  })

  if (!records.length) return { streak: 0, last_checkin: null }

  const dates       = records.map(r => r.dataValues.checkin_date as string)
  const lastCheckin = dates[0]

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = dayjs(dates[i - 1]).diff(dayjs(dates[i]), 'day')
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return { streak, last_checkin: lastCheckin }
}
