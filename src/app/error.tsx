'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="neo-card max-w-md p-8 text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">エラーが発生しました</h2>
        <p className="mb-6 text-muted-foreground">
          申し訳ありません。予期しないエラーが発生しました。
        </p>
        <button onClick={() => reset()} className="neo-button bg-primary px-6 py-3">
          もう一度試す
        </button>
      </div>
    </div>
  )
}
