'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createPomodoroService } from '@/services/pomodoro'
import type { ActionResult } from '@/types'
import type { PomodoroSession } from '@/generated/prisma'

export async function completePomodoroAction(
  durationMinutes: number
): Promise<ActionResult<PomodoroSession>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: '認証が必要です',
      }
    }

    const pomodoroService = createPomodoroService(prisma)
    const pomodoroSession = await pomodoroService.completePomodoro(
      session.user.id,
      durationMinutes
    )

    return {
      success: true,
      data: pomodoroSession,
    }
  } catch (error) {
    console.error('Failed to complete pomodoro:', error)
    return {
      success: false,
      error: 'ポモドーロの記録に失敗しました',
    }
  }
}

export async function getTodaysPomodorosAction(): Promise<
  ActionResult<{ count: number; sessions: PomodoroSession[] }>
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: '認証が必要です',
      }
    }

    const pomodoroService = createPomodoroService(prisma)
    const [count, sessions] = await Promise.all([
      pomodoroService.getTodaysPomodoroCount(session.user.id),
      pomodoroService.getTodaysPomodoroSessions(session.user.id),
    ])

    return {
      success: true,
      data: { count, sessions },
    }
  } catch (error) {
    console.error('Failed to get pomodoros:', error)
    return {
      success: false,
      error: 'ポモドーロ情報の取得に失敗しました',
    }
  }
}
