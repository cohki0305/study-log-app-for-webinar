import Link from 'next/link'

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="neo-card bg-white p-8 text-center">
          <div className="mb-4 text-6xl">📧</div>
          <h1 className="mb-2 text-2xl font-black text-foreground">メールを確認してください</h1>
          <p className="mb-6 text-muted-foreground">
            ログインリンクをお送りしました。
            <br />
            メールを確認してリンクをクリックしてください。
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            リンクは15分間有効です。届かない場合は迷惑メールフォルダを確認してください。
          </p>
          <Link href="/login" className="neo-button inline-block bg-secondary px-6 py-3">
            ログインページに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}
