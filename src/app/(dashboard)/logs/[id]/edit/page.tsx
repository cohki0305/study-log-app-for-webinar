import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { getStudyLogByIdAction } from '@/actions/study-log'
import { StudyLogForm } from '@/components/study-log/StudyLogForm'

type EditLogPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditLogPage({ params }: EditLogPageProps) {
  const { id } = await params
  const result = await getStudyLogByIdAction(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const log = result.data

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/logs" className="text-muted-foreground hover:text-foreground">
          ← 戻る
        </Link>
        <h1 className="text-3xl font-black">学習記録を編集</h1>
      </div>

      <div className="neo-card bg-white p-8">
        <StudyLogForm
          defaultValues={{
            id: log.id,
            studyDate: format(new Date(log.studyDate), 'yyyy-MM-dd'),
            content: log.content,
            durationMinutes: log.durationMinutes,
            reflection: log.reflection ?? undefined,
          }}
        />
      </div>
    </div>
  )
}
