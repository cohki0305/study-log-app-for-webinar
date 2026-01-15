import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { SignOutButton } from '@/components/auth/SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-3 border-black bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-black text-foreground">
            学習管理
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/logs" className="font-medium hover:text-primary">
              学習記録
            </Link>
            <Link href="/timer" className="font-medium hover:text-primary">
              タイマー
            </Link>
            <Link href="/badges" className="font-medium hover:text-primary">
              バッジ
            </Link>
            <Link href="/export" className="font-medium hover:text-primary">
              PDF出力
            </Link>
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{session.user.email}</span>
              <SignOutButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
