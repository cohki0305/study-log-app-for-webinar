import type { PrismaClient, StudyLog } from '@/generated/prisma'
import type { CreateStudyLogInput, UpdateStudyLogInput } from '@/lib/validations/study-log'
import { createStreakService } from './streak'

export function createStudyLogService(prisma: PrismaClient) {
  const streakService = createStreakService(prisma)

  return {
    async create(userId: string, input: CreateStudyLogInput): Promise<StudyLog> {
      const studyLog = await prisma.studyLog.create({
        data: {
          userId,
          studyDate: new Date(input.studyDate),
          content: input.content,
          durationMinutes: input.durationMinutes,
          reflection: input.reflection,
        },
      })

      // Update streak after creating a study log
      await streakService.updateStreak(userId)

      return studyLog
    },

    async update(userId: string, input: UpdateStudyLogInput): Promise<StudyLog> {
      // Verify ownership
      const existing = await prisma.studyLog.findFirst({
        where: { id: input.id, userId },
      })

      if (!existing) {
        throw new Error('Study log not found or unauthorized')
      }

      const studyLog = await prisma.studyLog.update({
        where: { id: input.id },
        data: {
          studyDate: new Date(input.studyDate),
          content: input.content,
          durationMinutes: input.durationMinutes,
          reflection: input.reflection,
        },
      })

      // Recalculate streak in case date changed
      await streakService.updateStreak(userId)

      return studyLog
    },

    async delete(userId: string, id: string): Promise<void> {
      // Verify ownership
      const existing = await prisma.studyLog.findFirst({
        where: { id, userId },
      })

      if (!existing) {
        throw new Error('Study log not found or unauthorized')
      }

      await prisma.studyLog.delete({
        where: { id },
      })

      // Recalculate streak after deletion
      await streakService.updateStreak(userId)
    },

    async findById(userId: string, id: string) {
      return prisma.studyLog.findFirst({
        where: { id, userId },
        include: {
          pomodoroSessions: true,
        },
      })
    },

    async findMany(
      userId: string,
      options: {
        page?: number
        pageSize?: number
        startDate?: string
        endDate?: string
      } = {}
    ) {
      const { page = 1, pageSize = 10, startDate, endDate } = options

      const where = {
        userId,
        ...(startDate || endDate
          ? {
              studyDate: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      }

      const [items, total] = await Promise.all([
        prisma.studyLog.findMany({
          where,
          include: {
            pomodoroSessions: true,
            _count: { select: { pomodoroSessions: true } },
          },
          orderBy: { studyDate: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.studyLog.count({ where }),
      ])

      return {
        items,
        total,
        page,
        pageSize,
        hasMore: total > page * pageSize,
      }
    },
  }
}
