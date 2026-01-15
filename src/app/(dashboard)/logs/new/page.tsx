import Link from 'next/link'
import { StudyLogForm } from '@/components/study-log/StudyLogForm'

export default function NewLogPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/logs" className="text-muted-foreground hover:text-foreground">
          ← 戻る
        </Link>
        <h1 className="text-3xl font-black">新規学習記録</h1>
      </div>

      <div className="neo-card bg-white p-8">
        <StudyLogForm />
      </div>
    </div>
  )
}
