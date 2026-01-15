import { useState, useEffect, useCallback, useRef } from 'react'

type UseTimerOptions = {
  duration: number // seconds
  onComplete?: () => void
}

type UseTimerReturn = {
  timeRemaining: number
  isRunning: boolean
  isComplete: boolean
  formattedTime: string
  start: () => void
  pause: () => void
  reset: () => void
}

export function useTimer({ duration, onComplete }: UseTimerOptions): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset when duration changes
  useEffect(() => {
    setTimeRemaining(duration)
    setIsComplete(false)
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [duration])

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1
          if (newTime <= 0) {
            setIsRunning(false)
            setIsComplete(true)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            onCompleteRef.current?.()
            return 0
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, timeRemaining])

  const start = useCallback(() => {
    if (!isComplete && timeRemaining > 0) {
      setIsRunning(true)
    }
  }, [isComplete, timeRemaining])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsComplete(false)
    setTimeRemaining(duration)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [duration])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    timeRemaining,
    isRunning,
    isComplete,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    reset,
  }
}
