import { z } from 'zod'

export const requestMagicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
})

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>
