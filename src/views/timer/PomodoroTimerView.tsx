'use client'

import { PomodoroTimer } from '@/components/timer/PomodoroTimer'
import useSWR from 'swr'
import { getTodaysPomodorosAction } from '@/actions/pomodoro'

export function PomodoroTimerView() {
  const { data, mutate } = useSWR('todays-pomodoros', getTodaysPomodorosAction)

  const handleComplete = () => {
    mutate()
  }

  const todayCount = data?.success ? data.data.count : 0

  return <PomodoroTimer todayCount={todayCount} onComplete={handleComplete} />
}
