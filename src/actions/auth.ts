'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { requestMagicLinkSchema } from '@/lib/validations/auth'
import { getLastMagicLink } from '@/lib/email'
import type { ActionResult } from '@/types'

type MagicLinkResult = {
  message: string
  devMagicLink?: string
}

export async function requestMagicLinkAction(
  prevState: ActionResult<MagicLinkResult> | null,
  formData: FormData
): Promise<ActionResult<MagicLinkResult>> {
  const rawData = {
    email: formData.get('email'),
  }

  const result = requestMagicLinkSchema.safeParse(rawData)

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      if (!fieldErrors[field]) {
        fieldErrors[field] = []
      }
      fieldErrors[field].push(issue.message)
    }
    return { success: false, error: '入力内容を確認してください', fieldErrors }
  }

  try {
    const headersList = await headers()
    await auth.api.signInMagicLink({
      headers: headersList,
      body: {
        email: result.data.email,
        callbackURL: '/logs',
      },
    })

    // In development, include the magic link in the response for easier testing
    const isDev = process.env.NODE_ENV === 'development'
    const lastLink = getLastMagicLink()

    return {
      success: true,
      data: {
        message: 'ログインリンクを送信しました',
        devMagicLink: isDev && lastLink ? lastLink.url : undefined,
      },
    }
  } catch (error) {
    console.error('Magic link request failed:', error)
    return { success: false, error: 'メール送信に失敗しました。もう一度お試しください。' }
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const headersList = await headers()
    await auth.api.signOut({
      headers: headersList,
    })
  } catch (error) {
    console.error('Sign out failed:', error)
  }

  redirect('/login')
}
