import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing action
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db', () => ({
  prisma: {},
}))

vi.mock('@/services/pomodoro', () => ({
  createPomodoroService: vi.fn(),
}))

import { completePomodoroAction, getTodaysPomodorosAction } from './pomodoro'
import { auth } from '@/lib/auth'
import { createPomodoroService } from '@/services/pomodoro'

describe('pomodoro actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('completePomodoroAction', () => {
    it('should return error if user is not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await completePomodoroAction(25)

      expect(result).toEqual({
        success: false,
        error: '認証が必要です',
      })
    })

    it('should complete pomodoro and return session data', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      }
      const mockPomodoroSession = {
        id: 'session-1',
        userId: 'user-1',
        durationMinutes: 25,
        completedAt: new Date(),
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never)
      const mockCompletePomodoro = vi.fn().mockResolvedValue(mockPomodoroSession)
      vi.mocked(createPomodoroService).mockReturnValue({
        completePomodoro: mockCompletePomodoro,
        getTodaysPomodoroCount: vi.fn(),
        getTodaysPomodoroSessions: vi.fn(),
      })

      const result = await completePomodoroAction(25)

      expect(result).toEqual({
        success: true,
        data: mockPomodoroSession,
      })
      expect(mockCompletePomodoro).toHaveBeenCalledWith('user-1', 25)
    })

    it('should return error on service failure', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never)
      const mockCompletePomodoro = vi.fn().mockRejectedValue(new Error('DB error'))
      vi.mocked(createPomodoroService).mockReturnValue({
        completePomodoro: mockCompletePomodoro,
        getTodaysPomodoroCount: vi.fn(),
        getTodaysPomodoroSessions: vi.fn(),
      })

      const result = await completePomodoroAction(25)

      expect(result).toEqual({
        success: false,
        error: 'ポモドーロの記録に失敗しました',
      })
    })
  })

  describe('getTodaysPomodorosAction', () => {
    it('should return error if user is not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await getTodaysPomodorosAction()

      expect(result).toEqual({
        success: false,
        error: '認証が必要です',
      })
    })

    it('should return today\'s pomodoro count and sessions', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      }
      const mockSessions = [
        { id: 'session-1', durationMinutes: 25, completedAt: new Date() },
      ]

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as never)
      const mockGetCount = vi.fn().mockResolvedValue(3)
      const mockGetSessions = vi.fn().mockResolvedValue(mockSessions)
      vi.mocked(createPomodoroService).mockReturnValue({
        completePomodoro: vi.fn(),
        getTodaysPomodoroCount: mockGetCount,
        getTodaysPomodoroSessions: mockGetSessions,
      })

      const result = await getTodaysPomodorosAction()

      expect(result).toEqual({
        success: true,
        data: {
          count: 3,
          sessions: mockSessions,
        },
      })
    })
  })
})
