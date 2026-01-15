import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-black text-foreground md:text-6xl">
            学習を
            <span className="bg-primary px-2">記録</span>
            して
            <br />
            <span className="bg-secondary px-2">成長</span>
            を実感しよう
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            毎日の学習を記録し、ポモドーロタイマーで集中力を高め、
            ストリークとバッジでモチベーションを維持しましょう。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="neo-button bg-primary px-8 py-4 text-lg">
              無料で始める
            </Link>
            <Link
              href="/login"
              className="neo-button bg-white px-8 py-4 text-lg text-foreground"
            >
              ログイン
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">主な機能</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="neo-card bg-white p-6">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-xl font-bold">学習記録</h3>
            <p className="text-muted-foreground">
              日々の学習内容、時間、振り返りを簡単に記録。過去の記録も一覧で確認できます。
            </p>
          </div>
          <div className="neo-card bg-white p-6">
            <div className="mb-4 text-4xl">🍅</div>
            <h3 className="mb-2 text-xl font-bold">ポモドーロタイマー</h3>
            <p className="text-muted-foreground">
              25分の集中と5分の休憩で効率的に学習。完了したセッションは自動で記録されます。
            </p>
          </div>
          <div className="neo-card bg-white p-6">
            <div className="mb-4 text-4xl">🏆</div>
            <h3 className="mb-2 text-xl font-bold">ゲーミフィケーション</h3>
            <p className="text-muted-foreground">
              連続学習日数（ストリーク）とバッジでモチベーションを維持。目標達成を楽しく！
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="neo-card bg-accent p-8 text-center md:p-12">
          <h2 className="mb-4 text-3xl font-bold text-foreground">今すぐ始めよう</h2>
          <p className="mb-6 text-lg text-foreground/80">
            メールアドレスだけで登録完了。パスワード不要のマジックリンク認証。
          </p>
          <Link href="/login" className="neo-button bg-primary px-8 py-4 text-lg">
            無料で始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-black bg-white py-8">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-muted-foreground">
            &copy; 2026 学習管理アプリ. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
