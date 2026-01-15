import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="neo-card bg-white p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-black text-foreground">ログイン</h1>
            <p className="text-muted-foreground">
              メールアドレスを入力してログインリンクを受け取りましょう
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
