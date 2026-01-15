import { StudyLogCard } from './StudyLogCard'
import type { StudyLog, PomodoroSession } from '@/generated/prisma'

type StudyLogWithPomodoros = StudyLog & {
  pomodoroSessions: PomodoroSession[]
  _count: { pomodoroSessions: number }
}

type StudyLogListProps = {
  logs: StudyLogWithPomodoros[]
}

export function StudyLogList({ logs }: StudyLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="neo-card bg-white p-8 text-center">
        <div className="mb-4 text-4xl">📝</div>
        <p className="text-muted-foreground">まだ学習記録がありません</p>
        <p className="mt-2 text-sm text-muted-foreground">
          「新規作成」ボタンから最初の学習記録を作成しましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <StudyLogCard key={log.id} log={log} />
      ))}
    </div>
  )
}
