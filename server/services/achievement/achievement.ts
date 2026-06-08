import { fn, col } from 'sequelize'
import AchievementDef from '../../models/achievementDef'
import UserAchievement from '../../models/userAchievement'
import Checkin from '../../models/checkin'
import Workout from '../../models/workout'
import Habit from '../../models/habit'
import HabitLog from '../../models/habitLog'
import { getStreakService } from '../checkin/checkin'

const ACHIEVEMENT_DEFS = [
  { code: 'first_checkin',     title: '初心者',     description: '完成第一次打卡',          icon: 'star-o',     condition_type: 'checkin_count',  condition_value: 1  },
  { code: 'checkin_streak_7',  title: '坚持一周',   description: '连续打卡 7 天',            icon: 'fire-o',     condition_type: 'checkin_streak', condition_value: 7  },
  { code: 'checkin_streak_30', title: '一月长征',   description: '连续打卡 30 天',           icon: 'gem-o',      condition_type: 'checkin_streak', condition_value: 30 },
  { code: 'first_workout',     title: '迈出第一步', description: '完成第一次运动记录',        icon: 'smile-o',    condition_type: 'workout_count',  condition_value: 1  },
  { code: 'workout_10',        title: '运动达人',   description: '累计完成 10 次运动',        icon: 'gift-o',     condition_type: 'workout_count',  condition_value: 10 },
  { code: 'first_habit',       title: '好习惯起步', description: '创建第一个习惯',            icon: 'clock-o',    condition_type: 'habit_count',    condition_value: 1  },
  { code: 'habit_days_7',      title: '习惯成自然', description: '某个习惯累计完成 7 天',     icon: 'bookmark-o', condition_type: 'habit_max_days', condition_value: 7  },
  { code: 'habit_days_21',     title: '21 天定律',  description: '某个习惯累计完成 21 天',    icon: 'music-o',    condition_type: 'habit_max_days', condition_value: 21 },
]

// 进程内只需种一次，避免每次请求都执行 INSERT ON CONFLICT
let defsSeeded = false
async function seedDefs(): Promise<void> {
  if (defsSeeded) return
  await AchievementDef.bulkCreate(ACHIEVEMENT_DEFS as any[], { ignoreDuplicates: true })
  defsSeeded = true
}

async function getUserConditions(uid: number): Promise<Record<string, number>> {
  const [checkinCount, streakData, workoutCount, habitCount, habitDayCounts] = await Promise.all([
    Checkin.count({ where: { uid, is_del: 0 } }),
    getStreakService(uid),
    Workout.count({ where: { uid, is_del: 0 } }),
    Habit.count({ where: { uid, is_del: 0 } }),
    // 单条聚合查询取代 N+1：每个习惯的累计打卡天数
    HabitLog.findAll({
      where: { uid, is_del: 0 },
      attributes: ['hid', [fn('COUNT', col('id')), 'day_count']],
      group: ['hid'],
    }),
  ])

  const habitMaxDays = habitDayCounts.length
    ? Math.max(...habitDayCounts.map(r => Number(r.dataValues.day_count)))
    : 0

  return {
    checkin_count:  checkinCount,
    checkin_streak: streakData.streak,
    workout_count:  workoutCount,
    habit_count:    habitCount,
    habit_max_days: habitMaxDays,
  }
}

export const getAchievementListService = async (uid: number) => {
  await seedDefs()

  const [defs, alreadyUnlocked, conditions] = await Promise.all([
    AchievementDef.findAll({ order: [['id', 'ASC']] }),
    UserAchievement.findAll({ where: { uid } }),
    getUserConditions(uid),
  ])

  const unlockedMap = new Map<number, string>(
    alreadyUnlocked.map(u => [u.dataValues.ach_id as number, u.dataValues.unlocked_at as string])
  )

  // Unlock newly eligible achievements
  const toUnlock = defs
    .filter(def => {
      const id = def.dataValues.id as number
      if (unlockedMap.has(id)) return false
      const achieved = conditions[def.dataValues.condition_type as string] ?? 0
      return achieved >= (def.dataValues.condition_value as number)
    })
    .map(def => ({ uid, ach_id: def.dataValues.id as number }))

  if (toUnlock.length) {
    await UserAchievement.bulkCreate(toUnlock, { ignoreDuplicates: true })
    const refreshed = await UserAchievement.findAll({ where: { uid } })
    refreshed.forEach(u => unlockedMap.set(u.dataValues.ach_id as number, u.dataValues.unlocked_at as string))
  }

  return defs.map(def => {
    const id = def.dataValues.id as number
    const unlockedAt = unlockedMap.get(id) ?? null
    return { ...def.dataValues, unlocked: !!unlockedAt, unlocked_at: unlockedAt }
  })
}

export const getMyAchievementsService = async (uid: number) => {
  const all = await getAchievementListService(uid)
  return all.filter(achievement => achievement.unlocked)
}
