'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-server'
import { createStudyLogService } from '@/services/study-log'
import {
  createStudyLogSchema,
  updateStudyLogSchema,
  deleteStudyLogSchema,
} from '@/lib/validations/study-log'
import type { ActionResult, PaginatedResult } from '@/types'
import type { StudyLog, PomodoroSession } from '@/generated/prisma'

const studyLogService = createStudyLogService(prisma)

type StudyLogWithPomodoros = StudyLog & {
  pomodoroSessions: PomodoroSession[]
  _count: { pomodoroSessions: number }
}

export async function createStudyLogAction(
  _prevState: ActionResult<StudyLog> | null,
  formData: FormData
): Promise<ActionResult<StudyLog>> {
  try {
    const session = await requireAuth()

    const rawData = {
      studyDate: formData.get('studyDate'),
      content: formData.get('content'),
      durationMinutes: formData.get('durationMinutes'),
      reflection: formData.get('reflection') || undefined,
    }

    const result = createStudyLogSchema.safeParse(rawData)

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(issue.message)
      }
      return { success: false, error: '入力内容を確認してください', fieldErrors }
    }

    const studyLog = await studyLogService.create(session.user.id, result.data)

    revalidatePath('/logs')
    revalidatePath('/')

    return { success: true, data: studyLog }
  } catch (error) {
    console.error('Create study log failed:', error)
    return { success: false, error: '学習記録の作成に失敗しました' }
  }
}

export async function updateStudyLogAction(
  _prevState: ActionResult<StudyLog> | null,
  formData: FormData
): Promise<ActionResult<StudyLog>> {
  try {
    const session = await requireAuth()

    const rawData = {
      id: formData.get('id'),
      studyDate: formData.get('studyDate'),
      content: formData.get('content'),
      durationMinutes: formData.get('durationMinutes'),
      reflection: formData.get('reflection') || undefined,
    }

    const result = updateStudyLogSchema.safeParse(rawData)

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = []
        }
        fieldErrors[field].push(issue.message)
      }
      return { success: false, error: '入力内容を確認してください', fieldErrors }
    }

    const studyLog = await studyLogService.update(session.user.id, result.data)

    revalidatePath('/logs')
    revalidatePath(`/logs/${result.data.id}/edit`)
    revalidatePath('/')

    return { success: true, data: studyLog }
  } catch (error) {
    console.error('Update study log failed:', error)
    if (error instanceof Error && error.message === 'Study log not found or unauthorized') {
      return { success: false, error: '学習記録が見つかりません' }
    }
    return { success: false, error: '学習記録の更新に失敗しました' }
  }
}

export async function deleteStudyLogAction(id: string): Promise<ActionResult<null>> {
  try {
    const session = await requireAuth()

    const result = deleteStudyLogSchema.safeParse({ id })

    if (!result.success) {
      return { success: false, error: '無効なIDです' }
    }

    await studyLogService.delete(session.user.id, result.data.id)

    revalidatePath('/logs')
    revalidatePath('/')

    return { success: true, data: null }
  } catch (error) {
    console.error('Delete study log failed:', error)
    if (error instanceof Error && error.message === 'Study log not found or unauthorized') {
      return { success: false, error: '学習記録が見つかりません' }
    }
    return { success: false, error: '学習記録の削除に失敗しました' }
  }
}

export async function getStudyLogsAction(input?: {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}): Promise<ActionResult<PaginatedResult<StudyLogWithPomodoros>>> {
  try {
    const session = await requireAuth()

    const result = await studyLogService.findMany(session.user.id, input)

    return { success: true, data: result }
  } catch (error) {
    console.error('Get study logs failed:', error)
    return { success: false, error: '学習記録の取得に失敗しました' }
  }
}

export async function getStudyLogByIdAction(
  id: string
): Promise<ActionResult<StudyLogWithPomodoros | null>> {
  try {
    const session = await requireAuth()

    const studyLog = await studyLogService.findById(session.user.id, id)

    return { success: true, data: studyLog as StudyLogWithPomodoros | null }
  } catch (error) {
    console.error('Get study log failed:', error)
    return { success: false, error: '学習記録の取得に失敗しました' }
  }
}
