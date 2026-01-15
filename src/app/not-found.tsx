import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="neo-card max-w-md p-8 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">404 - ページが見つかりません</h2>
        <p className="mb-6 text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" className="neo-button inline-block bg-primary px-6 py-3">
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
