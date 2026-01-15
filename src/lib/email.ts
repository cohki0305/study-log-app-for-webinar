import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Store the last magic link for development purposes
let lastMagicLink: { email: string; url: string } | null = null

export function getLastMagicLink(): { email: string; url: string } | null {
  return lastMagicLink
}

export async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !resend) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`[DEV] Magic link for ${email}:`)
    console.log(url)
    console.log(`${'='.repeat(60)}\n`)
    lastMagicLink = { email, url }
    return
  }

  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: '学習管理アプリ - ログインリンク',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1A1A1A;">学習管理アプリ</h1>
        <p>以下のリンクをクリックしてログインしてください。</p>
        <a
          href="${url}"
          style="display: inline-block; background: #FF6B6B; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border: 3px solid #000;"
        >
          ログイン
        </a>
        <p style="color: #666; margin-top: 20px; font-size: 14px;">
          このリンクは15分間有効です。
        </p>
      </div>
    `,
  })
}
