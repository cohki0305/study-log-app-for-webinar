type TimerDisplayProps = {
  time: string
  isBreak: boolean
}

export function TimerDisplay({ time, isBreak }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`text-7xl font-black tabular-nums ${
          isBreak ? 'text-secondary' : 'text-primary'
        }`}
      >
        {time}
      </div>
      <div className="text-lg font-bold text-muted-foreground">
        {isBreak ? '休憩中' : '作業中'}
      </div>
    </div>
  )
}
