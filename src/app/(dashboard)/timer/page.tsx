import { PomodoroTimerView } from '@/views/timer/PomodoroTimerView'

export default function TimerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-center text-3xl font-black">ポモドーロタイマー</h1>
      <PomodoroTimerView />
    </div>
  )
}
