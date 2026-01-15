import type { PrismaClient, PomodoroSession } from '@/generated/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export function createPomodoroService(prisma: PrismaClient) {
  return {
    async completePomodoro(
      userId: string,
      durationMinutes: number
    ): Promise<PomodoroSession> {
      const now = new Date()
      const today = startOfDay(now)

      // Find today's study log if exists
      const todayStudyLog = await prisma.studyLog.findFirst({
        where: {
          userId,
          studyDate: today,
        },
      })

      // Create pomodoro session
      const session = await prisma.pomodoroSession.create({
        data: {
          userId,
          studyLogId: todayStudyLog?.id ?? null,
          durationMinutes,
          completedAt: now,
        },
      })

      // If there's a study log for today, add duration to it
      if (todayStudyLog) {
        await prisma.studyLog.update({
          where: { id: todayStudyLog.id },
          data: {
            durationMinutes: todayStudyLog.durationMinutes + durationMinutes,
          },
        })
      }

      return session
    },

    async getTodaysPomodoroCount(userId: string): Promise<number> {
      const now = new Date()
      const start = startOfDay(now)
      const end = endOfDay(now)

      return prisma.pomodoroSession.count({
        where: {
          userId,
          completedAt: {
            gte: start,
            lt: end,
          },
        },
      })
    },

    async getTodaysPomodoroSessions(userId: string): Promise<PomodoroSession[]> {
      const now = new Date()
      const start = startOfDay(now)
      const end = endOfDay(now)

      return prisma.pomodoroSession.findMany({
        where: {
          userId,
          completedAt: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { completedAt: 'desc' },
      })
    },
  }
}
