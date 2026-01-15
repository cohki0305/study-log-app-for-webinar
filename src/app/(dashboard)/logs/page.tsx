import Link from 'next/link'
import { getStudyLogsAction } from '@/actions/study-log'
import { StudyLogList } from '@/components/study-log/StudyLogList'

export default async function LogsPage() {
  const result = await getStudyLogsAction({ pageSize: 20 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">学習記録</h1>
        <Link href="/logs/new" className="neo-button bg-primary px-6 py-3">
          新規作成
        </Link>
      </div>

      {result.success ? (
        <>
          <StudyLogList logs={result.data.items} />
          {result.data.hasMore && (
            <p className="text-center text-muted-foreground">
              {result.data.total}件中 {result.data.items.length}件を表示
            </p>
          )}
        </>
      ) : (
        <div className="neo-card bg-white p-8 text-center">
          <p className="text-destructive">{result.error}</p>
        </div>
      )}
    </div>
  )
}
