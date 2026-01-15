type TimerControlsProps = {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4">
      {isRunning ? (
        <button
          onClick={onPause}
          className="neo-button bg-accent px-8 py-4 text-lg"
        >
          一時停止
        </button>
      ) : (
        <button
          onClick={onStart}
          className="neo-button bg-primary px-8 py-4 text-lg text-white"
        >
          開始
        </button>
      )}
      <button
        onClick={onReset}
        className="neo-button bg-white px-8 py-4 text-lg"
      >
        リセット
      </button>
    </div>
  )
}
