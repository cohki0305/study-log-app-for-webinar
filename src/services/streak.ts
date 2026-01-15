import { differenceInDays, startOfDay, isSameDay } from 'date-fns'
import type { PrismaClient } from '@/generated/prisma'

export function createStreakService(prisma: PrismaClient) {
  return {
    async updateStreak(userId: string): Promise<{ currentStreak: number; maxStreak: number }> {
      // Get all study logs for user, ordered by study date descending
      const logs = await prisma.studyLog.findMany({
        where: { userId },
        select: { studyDate: true },
        orderBy: { studyDate: 'desc' },
      })

      if (logs.length === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { currentStreak: 0, lastStudyDate: null },
        })
        return { currentStreak: 0, maxStreak: 0 }
      }

      // Get unique dates (in case of multiple logs per day)
      const uniqueDates = Array.from(
        new Set(logs.map((log) => startOfDay(log.studyDate).getTime()))
      )
        .map((time) => new Date(time))
        .sort((a, b) => b.getTime() - a.getTime())

      // Calculate current streak
      const today = startOfDay(new Date())
      let currentStreak = 0

      // Check if most recent log is today or yesterday
      const mostRecentDate = uniqueDates[0]
      const daysDiff = differenceInDays(today, mostRecentDate)

      if (daysDiff > 1) {
        // Streak is broken
        currentStreak = 0
      } else {
        // Count consecutive days
        currentStreak = 1
        for (let i = 1; i < uniqueDates.length; i++) {
          const diff = differenceInDays(uniqueDates[i - 1], uniqueDates[i])
          if (diff === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }

      // Get current max streak from user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { maxStreak: true },
      })

      const maxStreak = Math.max(currentStreak, user?.maxStreak ?? 0)

      // Update user streak
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak,
          maxStreak,
          lastStudyDate: mostRecentDate,
        },
      })

      return { currentStreak, maxStreak }
    },

    calculateConsecutiveDays(dates: Date[]): number {
      if (dates.length === 0) return 0

      // Sort dates in descending order
      const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime())

      // Get unique dates
      const uniqueDates: Date[] = []
      for (const date of sortedDates) {
        const dayStart = startOfDay(date)
        if (!uniqueDates.some((d) => isSameDay(d, dayStart))) {
          uniqueDates.push(dayStart)
        }
      }

      if (uniqueDates.length === 0) return 0

      let streak = 1
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = differenceInDays(uniqueDates[i - 1], uniqueDates[i])
        if (diff === 1) {
          streak++
        } else {
          break
        }
      }

      return streak
    },
  }
}
