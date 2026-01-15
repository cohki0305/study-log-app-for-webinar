import { z } from 'zod'

export const createStudyLogSchema = z.object({
  studyDate: z.string().date('有効な日付を入力してください'),
  content: z
    .string()
    .min(1, '学習内容を入力してください')
    .max(3000, '3000文字以内で入力してください'),
  durationMinutes: z.coerce
    .number()
    .int('整数を入力してください')
    .min(0, '0以上の数値を入力してください'),
  reflection: z.string().max(1000, '1000文字以内で入力してください').optional(),
})

export const updateStudyLogSchema = createStudyLogSchema.extend({
  id: z.string().cuid('無効なIDです'),
})

export const deleteStudyLogSchema = z.object({
  id: z.string().cuid('無効なIDです'),
})

export type CreateStudyLogInput = z.infer<typeof createStudyLogSchema>
export type UpdateStudyLogInput = z.infer<typeof updateStudyLogSchema>
