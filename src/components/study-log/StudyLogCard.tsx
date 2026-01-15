'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { deleteStudyLogAction } from '@/actions/study-log'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type StudyLogCardProps = {
  log: {
    id: string
    studyDate: Date
    content: string
    durationMinutes: number
    reflection?: string | null
    _count?: { pomodoroSessions: number }
  }
}

export function StudyLogCard({ log }: StudyLogCardProps) {
  const handleDelete = async () => {
    if (!confirm('この学習記録を削除しますか？')) return

    const result = await deleteStudyLogAction(log.id)

    if (result.success) {
      toast.success('学習記録を削除しました')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="neo-card bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(log.studyDate), 'yyyy年M月d日 (E)', { locale: ja })}
          </p>
          <div className="mt-1 flex items-center gap-4">
            <span className="font-bold">{log.durationMinutes}分</span>
            {log._count && log._count.pomodoroSessions > 0 && (
              <span className="flex items-center gap-1 text-sm">
                🍅 {log._count.pomodoroSessions}回
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/logs/${log.id}/edit`}>
            <Button variant="outline" size="sm" className="neo-button border-2 bg-white px-3 py-1">
              編集
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="neo-button border-2 bg-white px-3 py-1 text-destructive"
          >
            削除
          </Button>
        </div>
      </div>

      <p className="mb-2 whitespace-pre-wrap text-foreground">{log.content}</p>

      {log.reflection && (
        <div className="mt-4 border-t-2 border-dashed border-muted pt-4">
          <p className="text-sm font-bold text-muted-foreground">振り返り</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{log.reflection}</p>
        </div>
      )}
    </div>
  )
}
