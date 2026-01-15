# Research: 学習管理アプリ

**Date**: 2026-01-15
**Feature**: 001-study-log-app

## 1. Better Auth マジックリンク認証

### Decision
Better Authの組み込みマジックリンクプラグインを使用する。

### Rationale
- Better Authはマジックリンク認証をネイティブサポート
- トークン生成、有効期限管理、メール送信の統合が容易
- Prismaアダプターとの連携が良好
- Constitution VII準拠

### Configuration
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Resend/Nodemailerでメール送信
      },
      expiresIn: 60 * 15, // 15分
    })
  ]
})
```

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| NextAuth | Better AuthがConstitution指定 |
| 独自実装 | セキュリティリスク、開発工数増 |
| Clerk/Auth0 | 外部サービス依存、コスト |

---

## 2. メール送信サービス

### Decision
Resendを使用する（開発環境ではコンソール出力）。

### Rationale
- シンプルなAPI
- 無料枠で十分（月3,000通）
- TypeScript SDKあり
- 開発環境では実際のメール送信不要

### Implementation
```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLinkEmail(email: string, url: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Magic link for ${email}: ${url}`)
    return
  }

  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: '学習管理アプリ - ログインリンク',
    html: `<a href="${url}">ログイン</a>`
  })
}
```

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| Nodemailer | SMTPサーバー設定が必要 |
| SendGrid | 設定が複雑、過剰 |
| AWS SES | インフラ設定が必要 |

---

## 3. PDF生成ライブラリ

### Decision
@react-pdf/rendererを使用（クライアントサイド生成）。

### Rationale
- Reactコンポーネントとして定義可能
- サーバーリソース不要
- スタイリングが柔軟
- 日本語フォント対応可能

### Implementation
```typescript
// components/pdf/StudyLogPdf.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export function StudyLogPdf({ logs }: { logs: StudyLog[] }) {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>学習記録</Text>
          {logs.map(log => (
            <View key={log.id}>
              <Text>{log.date}: {log.content}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
```

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| puppeteer | サーバーリソース大、Vercel制限 |
| jsPDF | React統合が弱い |
| pdfmake | スタイリングが制限的 |

---

## 4. ポモドーロタイマー実装

### Decision
useTimer カスタムフック + setInterval でクライアントサイド実装。

### Rationale
- シンプルで理解しやすい
- サーバー依存なし（オフライン対応可能）
- 状態管理が明確
- ブラウザ通知APIで完了通知

### Implementation
```typescript
// hooks/useTimer.ts
export function useTimer(initialMinutes: number) {
  const [seconds, setSeconds] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setIsRunning(false)
          // 通知を表示
          new Notification('ポモドーロ完了!')
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  return { seconds, isRunning, start, pause, reset }
}
```

### Considerations
- タブがバックグラウンドでも動作するためrequestAnimationFrameではなくsetInterval使用
- ブラウザを閉じた場合はタイマー状態が失われる（仕様通り）
- 通知許可のリクエストが必要

---

## 5. ストリーク計算ロジック

### Decision
学習記録作成時にサービス層で計算・更新。

### Rationale
- 「学習日」フィールドに基づく計算（作成日時ではない）
- 過去日付の記録追加にも対応
- トランザクションでデータ整合性を保証

### Implementation
```typescript
// services/streak.ts
export function createStreakService(prisma: PrismaClient) {
  return {
    async updateStreak(userId: string): Promise<void> {
      const logs = await prisma.studyLog.findMany({
        where: { userId },
        select: { studyDate: true },
        orderBy: { studyDate: 'desc' }
      })

      // 連続日数を計算
      const streak = calculateConsecutiveDays(logs.map(l => l.studyDate))

      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: streak,
          maxStreak: { increment: streak > user.maxStreak ? streak - user.maxStreak : 0 }
        }
      })
    }
  }
}

function calculateConsecutiveDays(dates: Date[]): number {
  // date-fnsを使用して連続日数を計算
}
```

---

## 6. バッジ判定システム

### Decision
イベント駆動型の判定。学習記録作成・ポモドーロ完了時に条件チェック。

### Rationale
- リアルタイムでバッジ獲得を通知可能
- 条件は設定ファイルで管理
- 拡張性が高い

### Badge Definitions
```typescript
// lib/badges.ts
export const BADGE_DEFINITIONS = [
  {
    id: 'first-log',
    name: '初めての学習記録',
    description: '最初の学習記録を作成',
    condition: (stats) => stats.totalLogs >= 1
  },
  {
    id: 'streak-3',
    name: '3日連続学習',
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak-7',
    name: '7日連続学習',
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'streak-30',
    name: '30日連続学習',
    condition: (stats) => stats.currentStreak >= 30
  },
  {
    id: 'pomodoro-master',
    name: 'ポモドーロマスター',
    condition: (stats) => stats.totalPomodoros >= 100
  },
  {
    id: 'study-expert',
    name: '学習の達人',
    condition: (stats) => stats.totalMinutes >= 6000 // 100時間
  }
]
```

---

## 7. X (Twitter) Web Intent

### Decision
X Web Intent URLを使用（API連携なし）。

### Rationale
- 認証不要
- シンプルな実装
- ユーザーがテキストを編集可能

### Implementation
```typescript
// lib/share.ts
export function generateXShareUrl(text: string): string {
  const encodedText = encodeURIComponent(text)
  return `https://twitter.com/intent/tweet?text=${encodedText}`
}

// 使用例
const shareText = `今日は${duration}分学習しました！ #学習記録`
window.open(generateXShareUrl(shareText), '_blank')
```

---

## 8. 日本語フォント（PDF用）

### Decision
Noto Sans JPを使用（Google Fonts経由）。

### Rationale
- 無料で商用利用可
- 日本語の可読性が高い
- @react-pdf/rendererで登録可能

### Implementation
```typescript
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/s/notosansjp/v42/...'
})
```

---

## 9. Neobrutalism デザインシステム

### Decision
Tailwind CSSのカスタム設定でNeobrutalism スタイルを実装。

### Rationale
- shadcn/uiと組み合わせてカスタマイズ可能
- クラス名で一貫したスタイル適用
- ダークモード対応も容易

### Key Characteristics
| 特徴 | 実装 |
|------|------|
| 太いボーダー | `border-3 border-black` (3px) |
| オフセットシャドウ | `shadow-brutal` (4px 4px 0 0 #000) |
| 鮮やかな配色 | カスタムカラーパレット |
| 角丸なし | `rounded-none` または最小 |
| ホバー効果 | 影が大きくなる |
| クリック効果 | 影が小さくなり押し込まれる |

### Color Palette
```css
:root {
  --background: #FFFEF0;      /* クリーム */
  --primary: #FF6B6B;         /* コーラル */
  --secondary: #4ECDC4;       /* ティール */
  --accent: #FFE66D;          /* イエロー */
  --border: #000000;          /* ブラック */
  --foreground: #1A1A1A;      /* ダークグレー */
}
```

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| Glassmorphism | トレンドが過ぎた、アクセシビリティ問題 |
| Material Design | 一般的すぎる、個性がない |
| Neumorphism | コントラスト不足、視認性問題 |

---

## 10. Bento Grid レイアウト

### Decision
CSS Gridで実装。異なるサイズのカードを組み合わせる。

### Rationale
- 情報の階層を視覚的に表現
- 重要度に応じたカードサイズ
- レスポンシブ対応が容易

### Grid Configuration
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 120px;
  gap: 1rem;
}

/* レスポンシブ */
@media (max-width: 1024px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .bento-grid { grid-template-columns: 1fr; }
}
```

### Card Sizes
| サイズ | Grid Span | 用途 |
|--------|-----------|------|
| XS (1x1) | col-span-1 row-span-1 | 統計数値 |
| SM (1x2) | col-span-1 row-span-2 | 縦長情報（タイマー、バッジ） |
| MD (2x1) | col-span-2 row-span-1 | 横長コンテンツ |
| LG (2x2) | col-span-2 row-span-2 | メイン情報（ストリーク） |

### Reference
- Apple WWDC Bento presentations
- Linear.app dashboard
- Vercel dashboard

---

## Summary

| 項目 | 選択 |
|------|------|
| 認証 | Better Auth + Magic Link Plugin |
| メール | Resend |
| PDF | @react-pdf/renderer |
| タイマー | カスタムフック + setInterval |
| ストリーク | サービス層で計算 |
| バッジ | イベント駆動型判定 |
| X共有 | Web Intent |
| 日本語フォント | Noto Sans JP |
| デザインスタイル | Neobrutalism |
| レイアウト | Bento Grid |
