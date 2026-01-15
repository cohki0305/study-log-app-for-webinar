'use client'

import { useActionState } from 'react'
import { format } from 'date-fns'
import { createStudyLogAction, updateStudyLogAction } from '@/actions/study-log'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type StudyLogFormProps = {
  defaultValues?: {
    id?: string
    studyDate?: string
    content?: string
    durationMinutes?: number
    reflection?: string
  }
  onSuccess?: () => void
}

export function StudyLogForm({ defaultValues, onSuccess }: StudyLogFormProps) {
  const isEditing = !!defaultValues?.id
  const action = isEditing ? updateStudyLogAction : createStudyLogAction
  const [state, formAction, pending] = useActionState(action, null)

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={defaultValues.id} />}

      <div className="space-y-2">
        <Label htmlFor="studyDate">学習日</Label>
        <Input
          id="studyDate"
          name="studyDate"
          type="date"
          defaultValue={defaultValues?.studyDate ?? today}
          max={today}
          required
          className="neo-input"
        />
        {state?.success === false && state.fieldErrors?.studyDate && (
          <p className="text-sm text-destructive">{state.fieldErrors.studyDate[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">学習内容</Label>
        <textarea
          id="content"
          name="content"
          defaultValue={defaultValues?.content}
          placeholder="今日学習した内容を入力してください"
          required
          rows={5}
          className="neo-input w-full resize-none"
        />
        {state?.success === false && state.fieldErrors?.content && (
          <p className="text-sm text-destructive">{state.fieldErrors.content[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationMinutes">学習時間（分）</Label>
        <Input
          id="durationMinutes"
          name="durationMinutes"
          type="number"
          min={0}
          defaultValue={defaultValues?.durationMinutes ?? 0}
          required
          className="neo-input"
        />
        {state?.success === false && state.fieldErrors?.durationMinutes && (
          <p className="text-sm text-destructive">{state.fieldErrors.durationMinutes[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reflection">振り返り（任意）</Label>
        <textarea
          id="reflection"
          name="reflection"
          defaultValue={defaultValues?.reflection}
          placeholder="工夫した点や気づきを入力してください"
          rows={3}
          className="neo-input w-full resize-none"
        />
        {state?.success === false && state.fieldErrors?.reflection && (
          <p className="text-sm text-destructive">{state.fieldErrors.reflection[0]}</p>
        )}
      </div>

      {state?.success === false && !state.fieldErrors && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      {state?.success === true && (
        <p className="text-sm text-secondary">
          {isEditing ? '学習記録を更新しました' : '学習記録を作成しました'}
        </p>
      )}

      <Button type="submit" disabled={pending} className="neo-button w-full bg-primary py-3">
        {pending ? '保存中...' : '保存'}
      </Button>
    </form>
  )
}
