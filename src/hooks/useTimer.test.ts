import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the given duration', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 }))

    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isComplete).toBe(false)
  })

  it('should start the timer when start is called', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 }))

    act(() => {
      result.current.start()
    })

    expect(result.current.isRunning).toBe(true)
  })

  it('should count down when running', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeRemaining).toBe(25 * 60 - 1)
  })

  it('should pause the timer when pause is called', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.pause()
    })

    expect(result.current.isRunning).toBe(false)
    const timeAfterPause = result.current.timeRemaining

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timeRemaining).toBe(timeAfterPause)
  })

  it('should reset the timer when reset is called', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isComplete).toBe(false)
  })

  it('should call onComplete when timer reaches zero', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      useTimer({ duration: 3, onComplete })
    )

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.isComplete).toBe(true)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeRemaining).toBe(0)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('should not go below zero', () => {
    const { result } = renderHook(() => useTimer({ duration: 2 }))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.timeRemaining).toBe(0)
  })

  it('should format time correctly', () => {
    const { result } = renderHook(() => useTimer({ duration: 25 * 60 + 30 }))

    expect(result.current.formattedTime).toBe('25:30')
  })

  it('should format single digit seconds with leading zero', () => {
    const { result } = renderHook(() => useTimer({ duration: 5 * 60 + 5 }))

    expect(result.current.formattedTime).toBe('05:05')
  })
})
