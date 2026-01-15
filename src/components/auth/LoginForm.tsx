'use client'

import { useActionState } from 'react'
import { requestMagicLinkAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [state, action, pending] = useActionState(requestMagicLinkAction, null)

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="neo-input"
        />
        {state?.success === false && state.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {state?.success === false && !state.fieldErrors && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      {state?.success === true && (
        <div className="space-y-2">
          <p className="text-sm text-secondary">{state.data.message}</p>
          {state.data.devMagicLink && (
            <div className="rounded border-2 border-dashed border-accent bg-accent/10 p-4">
              <p className="mb-2 text-xs font-bold text-muted-foreground">
                [開発モード] マジックリンク:
              </p>
              <a
                href={state.data.devMagicLink}
                className="block break-all text-sm text-primary underline hover:no-underline"
              >
                {state.data.devMagicLink}
              </a>
            </div>
          )}
        </div>
      )}

      <Button type="submit" disabled={pending} className="neo-button w-full bg-primary py-3">
        {pending ? '送信中...' : 'ログインリンクを送信'}
      </Button>
    </form>
  )
}
