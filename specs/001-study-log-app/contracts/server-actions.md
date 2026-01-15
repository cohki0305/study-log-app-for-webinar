# Server Actions Contract: 学習管理アプリ

**Date**: 2026-01-15
**Feature**: 001-study-log-app

このドキュメントはServer Actionsのインターフェース仕様を定義します。
Constitution V準拠: Server Actions基本、Zodバリデーション必須。

---

## Common Types

```typescript
// types/action-result.ts
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// types/pagination.ts
export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

---

## Authentication Actions

### requestMagicLinkAction

マジックリンクをリクエストする。

```typescript
// actions/auth.ts
'use server'

// Input Schema
const requestMagicLinkSchema = z.object({
  email: z.string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください')
})

// Signature
export async function requestMagicLinkAction(
  prevState: ActionResult<{ message: string }> | null,
  formData: FormData
): Promise<ActionResult<{ message: string }>>

// Success Response
{ success: true, data: { message: 'ログインリンクを送信しました' } }

// Error Response
{ success: false, error: 'メール送信に失敗しました' }
{ success: false, fieldErrors: { email: ['有効なメールアドレスを入力してください'] } }
```

### signOutAction

ログアウトする。

```typescript
// actions/auth.ts
'use server'

// Signature (no input)
export async function signOutAction(): Promise<ActionResult<null>>

// Success Response
{ success: true, data: null }
// リダイレクト to /login
```

---

## Study Log Actions

### createStudyLogAction

学習記録を作成する。

```typescript
// actions/study-log.ts
'use server'

// Input Schema
const createStudyLogSchema = z.object({
  studyDate: z.string().date('有効な日付を入力してください'),
  content: z.string().min(1, '学習内容を入力してください').max(3000, '3000文字以内で入力してください'),
  durationMinutes: z.coerce.number().int().min(0, '0以上の数値を入力してください'),
  reflection: z.string().max(1000, '1000文字以内で入力してください').optional()
})

// Signature
export async function createStudyLogAction(
  prevState: ActionResult<StudyLog> | null,
  formData: FormData
): Promise<ActionResult<StudyLog>>

// Success Response
{
  success: true,
  data: {
    id: 'clxxx...',
    userId: 'clyyy...',
    studyDate: '2026-01-15T00:00:00.000Z',
    content: '...',
    durationMinutes: 60,
    reflection: '...',
    createdAt: '...',
    updatedAt: '...'
  }
}

// Side Effects
// - ストリーク更新
// - バッジ判定・付与
```

### updateStudyLogAction

学習記録を更新する。

```typescript
// actions/study-log.ts
'use server'

// Input Schema
const updateStudyLogSchema = z.object({
  id: z.string().cuid(),
  studyDate: z.string().date('有効な日付を入力してください'),
  content: z.string().min(1).max(3000),
  durationMinutes: z.coerce.number().int().min(0),
  reflection: z.string().max(1000).optional()
})

// Signature
export async function updateStudyLogAction(
  prevState: ActionResult<StudyLog> | null,
  formData: FormData
): Promise<ActionResult<StudyLog>>

// Authorization
// - ログインユーザーの記録のみ更新可能
```

### deleteStudyLogAction

学習記録を削除する。

```typescript
// actions/study-log.ts
'use server'

// Input Schema
const deleteStudyLogSchema = z.object({
  id: z.string().cuid()
})

// Signature
export async function deleteStudyLogAction(
  id: string
): Promise<ActionResult<null>>

// Side Effects
// - 紐づくPomodoroSessionも削除（Cascade）
// - ストリーク再計算
```

### getStudyLogsAction

学習記録一覧を取得する（データフェッチ用）。

```typescript
// actions/study-log.ts
'use server'

// Input
type GetStudyLogsInput = {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

// Signature
export async function getStudyLogsAction(
  input?: GetStudyLogsInput
): Promise<ActionResult<PaginatedResult<StudyLogWithPomodoros>>>

// Response Type
type StudyLogWithPomodoros = StudyLog & {
  pomodoroSessions: PomodoroSession[]
  _count: { pomodoroSessions: number }
}
```

### getStudyLogByIdAction

学習記録を1件取得する。

```typescript
// actions/study-log.ts
'use server'

// Signature
export async function getStudyLogByIdAction(
  id: string
): Promise<ActionResult<StudyLogWithPomodoros | null>>
```

---

## Pomodoro Actions

### completePomodoroAction

ポモドーロセッションを完了し記録する。

```typescript
// actions/pomodoro.ts
'use server'

// Input Schema
const completePomodoroSchema = z.object({
  durationMinutes: z.number().int().min(1).default(25)
})

// Signature
export async function completePomodoroAction(
  input?: { durationMinutes?: number }
): Promise<ActionResult<{ studyLog: StudyLog; pomodoroSession: PomodoroSession }>>

// Business Logic
// 1. 当日のStudyLogを検索
// 2. なければ自動作成（content: 'ポモドーロ学習', durationMinutes: 0）
// 3. PomodoroSessionを作成
// 4. StudyLog.durationMinutes を更新
// 5. バッジ判定
```

---

## Badge Actions

### getBadgesAction

バッジ一覧を取得する（獲得状況含む）。

```typescript
// actions/badge.ts
'use server'

// Response Type
type BadgeWithStatus = Badge & {
  earned: boolean
  earnedAt: Date | null
}

// Signature
export async function getBadgesAction(): Promise<ActionResult<BadgeWithStatus[]>>
```

### checkAndAwardBadgesAction

バッジ獲得条件をチェックし、条件を満たしていれば付与する。

```typescript
// actions/badge.ts
'use server'

// Response Type
type AwardedBadge = {
  badge: Badge
  isNew: boolean
}

// Signature
export async function checkAndAwardBadgesAction(): Promise<ActionResult<AwardedBadge[]>>

// Internal use - 学習記録作成/ポモドーロ完了時に呼び出し
```

---

## Dashboard Actions

### getDashboardStatsAction

ダッシュボード統計を取得する。

```typescript
// actions/dashboard.ts
'use server'

// Response Type
type DashboardStats = {
  currentStreak: number
  maxStreak: number
  totalLogs: number
  totalMinutes: number
  totalPomodoros: number
  recentBadges: (UserBadge & { badge: Badge })[]
  todayLog: StudyLog | null
}

// Signature
export async function getDashboardStatsAction(): Promise<ActionResult<DashboardStats>>
```

---

## Export Actions

### generatePdfDataAction

PDF出力用のデータを取得する。

```typescript
// actions/export.ts
'use server'

// Input Schema
const generatePdfDataSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date()
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: '開始日は終了日以前である必要があります'
})

// Response Type
type PdfExportData = {
  user: { name: string | null; email: string }
  period: { start: string; end: string }
  logs: StudyLogWithPomodoros[]
  summary: {
    totalLogs: number
    totalMinutes: number
    totalPomodoros: number
  }
}

// Signature
export async function generatePdfDataAction(
  prevState: ActionResult<PdfExportData> | null,
  formData: FormData
): Promise<ActionResult<PdfExportData>>
```

---

## Share Actions

### generateShareTextAction

X投稿用のテキストを生成する。

```typescript
// actions/share.ts
'use server'

// Input Schema
const generateShareTextSchema = z.object({
  type: z.enum(['daily', 'log', 'badge']),
  studyLogId: z.string().cuid().optional(),
  badgeId: z.string().optional()
})

// Signature
export async function generateShareTextAction(
  input: z.infer<typeof generateShareTextSchema>
): Promise<ActionResult<{ text: string; url: string }>>

// Response Examples
// Daily: '今日は60分学習しました！ポモドーロ2回完了 🍅 #学習記録'
// Badge: '「7日連続学習」バッジを獲得しました！🏆 #学習記録'
```

---

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| AUTH_REQUIRED | ログインが必要です | 未認証アクセス |
| NOT_FOUND | データが見つかりません | 存在しないリソース |
| FORBIDDEN | アクセス権限がありません | 他ユーザーのデータアクセス |
| VALIDATION_ERROR | 入力内容を確認してください | Zodバリデーション失敗 |
| INTERNAL_ERROR | エラーが発生しました | サーバーエラー |
