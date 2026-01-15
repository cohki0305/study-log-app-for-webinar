'use client'

import { signOutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="neo-button border-2 bg-white px-3 py-1"
      >
        ログアウト
      </Button>
    </form>
  )
}
