'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { completePomodoroAction } from '@/actions/pomodoro'

const WORK_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60 // 5 minutes in seconds

type PomodoroTimerProps = {
  todayCount?: number
  onComplete?: () => void
}

export function PomodoroTimer({ todayCount = 0, onComplete }: PomodoroTimerProps) {
  const [isBreak, setIsBreak] = useState(false)
  const [count, setCount] = useState(todayCount)

  useEffect(() => {
    setCount(todayCount)
  }, [todayCount])

  const handleComplete = useCallback(async () => {
    if (!isBreak) {
      // Work session completed - record it
      const result = await completePomodoroAction(25)
      if (result.success) {
        setCount((prev) => prev + 1)
        onComplete?.()
        // Request notification permission and notify
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('ポモドーロ完了!', {
            body: '25分の作業が完了しました。休憩を取りましょう!',
            icon: '/favicon.ico',
          })
        }
      }
      // Auto-switch to break mode
      setIsBreak(true)
    } else {
      // Break completed - notify
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('休憩終了!', {
          body: '5分の休憩が終わりました。次の作業を始めましょう!',
          icon: '/favicon.ico',
        })
      }
      // Auto-switch to work mode
      setIsBreak(false)
    }
  }, [isBreak, onComplete])

  const duration = isBreak ? BREAK_DURATION : WORK_DURATION

  const { formattedTime, isRunning, start, pause, reset } = useTimer({
    duration,
    onComplete: handleComplete,
  })

  const handleModeSwitch = (breakMode: boolean) => {
    if (breakMode !== isBreak) {
      setIsBreak(breakMode)
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeSwitch(false)}
          className={`neo-button px-6 py-2 ${
            !isBreak ? 'bg-primary text-white' : 'bg-white'
          }`}
        >
          作業
        </button>
        <button
          onClick={() => handleModeSwitch(true)}
          className={`neo-button px-6 py-2 ${
            isBreak ? 'bg-secondary text-white' : 'bg-white'
          }`}
        >
          休憩
        </button>
      </div>

      {/* Timer Display */}
      <div className="neo-card bg-white p-12">
        <TimerDisplay time={formattedTime} isBreak={isBreak} />
      </div>

      {/* Controls */}
      <TimerControls
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      {/* Today's Count */}
      <div className="text-center">
        <p className="text-xl font-bold">今日: {count}ポモドーロ</p>
        <p className="text-sm text-muted-foreground">
          合計 {count * 25} 分の集中時間
        </p>
      </div>
    </div>
  )
}
