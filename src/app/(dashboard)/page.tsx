import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">ダッシュボード</h1>
      <p className="text-muted-foreground">
        学習記録の管理を始めましょう。下のカードから機能を選択してください。
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/logs" className="neo-card block bg-white p-6">
          <div className="mb-4 text-4xl">📝</div>
          <h2 className="mb-2 text-xl font-bold">学習記録</h2>
          <p className="text-muted-foreground">日々の学習を記録して振り返りましょう</p>
        </Link>

        <Link href="/timer" className="neo-card block bg-white p-6">
          <div className="mb-4 text-4xl">🍅</div>
          <h2 className="mb-2 text-xl font-bold">ポモドーロタイマー</h2>
          <p className="text-muted-foreground">25分の集中と5分の休憩で効率学習</p>
        </Link>

        <Link href="/badges" className="neo-card block bg-white p-6">
          <div className="mb-4 text-4xl">🏆</div>
          <h2 className="mb-2 text-xl font-bold">バッジ</h2>
          <p className="text-muted-foreground">獲得したバッジを確認しましょう</p>
        </Link>

        <Link href="/export" className="neo-card block bg-white p-6">
          <div className="mb-4 text-4xl">📄</div>
          <h2 className="mb-2 text-xl font-bold">PDF出力</h2>
          <p className="text-muted-foreground">学習記録をPDFで出力</p>
        </Link>
      </div>
    </div>
  )
}
