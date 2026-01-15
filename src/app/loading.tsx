export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="neo-card p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-3 border-black border-t-primary" />
          <p className="font-bold text-foreground">読み込み中...</p>
        </div>
      </div>
    </div>
  )
}
