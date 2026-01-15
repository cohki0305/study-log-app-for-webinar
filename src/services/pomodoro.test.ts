import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPomodoroService } from './pomodoro'
import type { PrismaClient } from '@/generated/prisma'

describe('pomodoroService', () => {
  const mockPrisma = {
    pomodoroSession: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    studyLog: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  } as unknown as PrismaClient

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('completePomodoro', () => {
    it('should create a pomodoro session and link to today\'s study log if exists', async () => {
      const service = createPomodoroService(mockPrisma)
      const userId = 'user-1'
      const durationMinutes = 25
      const now = new Date()

      const mockStudyLog = {
        id: 'log-1',
        userId,
        studyDate: now,
        content: 'Test study',
        durationMinutes: 30,
        reflection: null,
        createdAt: now,
        updatedAt: now,
      }

      const mockSession = {
        id: 'session-1',
        userId,
        studyLogId: mockStudyLog.id,
        durationMinutes,
        completedAt: now,
        createdAt: now,
      }

      vi.mocked(mockPrisma.studyLog.findFirst).mockResolvedValue(mockStudyLog)
      vi.mocked(mockPrisma.pomodoroSession.create).mockResolvedValue(mockSession)
      vi.mocked(mockPrisma.studyLog.update).mockResolvedValue({
        ...mockStudyLog,
        durationMinutes: mockStudyLog.durationMinutes + durationMinutes,
      })

      const result = await service.completePomodoro(userId, durationMinutes)

      expect(result).toEqual(mockSession)
      expect(mockPrisma.studyLog.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          studyDate: expect.any(Date),
        },
      })
      expect(mockPrisma.pomodoroSession.create).toHaveBeenCalledWith({
        data: {
          userId,
          studyLogId: mockStudyLog.id,
          durationMinutes,
          completedAt: expect.any(Date),
        },
      })
      expect(mockPrisma.studyLog.update).toHaveBeenCalledWith({
        where: { id: mockStudyLog.id },
        data: { durationMinutes: mockStudyLog.durationMinutes + durationMinutes },
      })
    })

    it('should create a pomodoro session without study log if none exists for today', async () => {
      const service = createPomodoroService(mockPrisma)
      const userId = 'user-1'
      const durationMinutes = 25
      const now = new Date()

      const mockSession = {
        id: 'session-1',
        userId,
        studyLogId: null,
        durationMinutes,
        completedAt: now,
        createdAt: now,
      }

      vi.mocked(mockPrisma.studyLog.findFirst).mockResolvedValue(null)
      vi.mocked(mockPrisma.pomodoroSession.create).mockResolvedValue(mockSession)

      const result = await service.completePomodoro(userId, durationMinutes)

      expect(result).toEqual(mockSession)
      expect(mockPrisma.pomodoroSession.create).toHaveBeenCalledWith({
        data: {
          userId,
          studyLogId: null,
          durationMinutes,
          completedAt: expect.any(Date),
        },
      })
      expect(mockPrisma.studyLog.update).not.toHaveBeenCalled()
    })
  })

  describe('getTodaysPomodoroCount', () => {
    it('should return count of pomodoro sessions completed today', async () => {
      const service = createPomodoroService(mockPrisma)
      const userId = 'user-1'

      vi.mocked(mockPrisma.pomodoroSession.count).mockResolvedValue(5)

      const result = await service.getTodaysPomodoroCount(userId)

      expect(result).toBe(5)
      expect(mockPrisma.pomodoroSession.count).toHaveBeenCalledWith({
        where: {
          userId,
          completedAt: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
      })
    })
  })

  describe('getTodaysPomodoroSessions', () => {
    it('should return pomodoro sessions completed today', async () => {
      const service = createPomodoroService(mockPrisma)
      const userId = 'user-1'
      const now = new Date()

      const mockSessions = [
        {
          id: 'session-1',
          userId,
          studyLogId: null,
          durationMinutes: 25,
          completedAt: now,
          createdAt: now,
        },
        {
          id: 'session-2',
          userId,
          studyLogId: null,
          durationMinutes: 25,
          completedAt: now,
          createdAt: now,
        },
      ]

      vi.mocked(mockPrisma.pomodoroSession.findMany).mockResolvedValue(mockSessions)

      const result = await service.getTodaysPomodoroSessions(userId)

      expect(result).toEqual(mockSessions)
      expect(mockPrisma.pomodoroSession.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          completedAt: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        orderBy: { completedAt: 'desc' },
      })
    })
  })
})
