# Implementation Plan: 学習管理アプリ

**Branch**: `001-study-log-app` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-study-log-app/spec.md`

## Summary

学習管理アプリは、ユーザーが日々の学習記録を管理し、ポモドーロタイマーで集中学習をサポートし、ゲーミフィケーション要素でモチベーションを維持するWebアプリケーション。マジックリンク認証、PDF出力、X投稿機能を備える。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Framework**: Next.js 14+ (App Router)
**Primary Dependencies**: Tailwind CSS, shadcn/ui, Zod, Prisma, Better Auth, SWR
**Storage**: PostgreSQL (via Prisma ORM)
**Testing**: Vitest + React Testing Library (RTL) + Testcontainers
**Target Platform**: Web (Modern browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: 同時100ユーザー、PDF出力30秒以内、タイマー精度±1秒
**Constraints**: マジックリンク認証（パスワードレス）、レスポンシブデザイン
**Scale/Scope**: 個人向け学習管理、初期はシンプルな機能セット

### 追加依存関係

| ライブラリ | 用途 |
|-----------|------|
| @react-pdf/renderer | PDF生成（クライアントサイド） |
| nodemailer / Resend | マジックリンクメール送信 |
| date-fns | 日付操作・ストリーク計算 |

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                        | Requirement                                                          | Status |
| -------------------------------- | -------------------------------------------------------------------- | ------ |
| I. TDD                           | テストを先に書いてから実装する                                       | [x]    |
| II. Presentational Component分離 | Presentationalはsrc/components/、Containerはsrc/views/に配置         | [x]    |
| III. デザインシステム            | 色彩・タイポグラフィ・スペーシングルールに準拠                       | [x]    |
| IV. Next.js ベストプラクティス   | App Router、Server Components優先、Route Groups使用                  | [x]    |
| V. Server Actions                | Server Actions基本、API RoutesはWebhook等のみ、Zodバリデーション必須 | [x]    |
| VI. 型安全性                     | TypeScript Strict Mode、Prisma型活用                                 | [x]    |
| VII. 認証                        | Better Auth使用、CSRF保護                                            | [x]    |
| VIII. フォーム管理               | useActionState基本、react-hook-formは複雑なフォームのみ              | [x]    |
| IX. 状態管理                     | Server Components + props基本、Jotaiは必要時のみ                     | [x]    |
| X. エラーハンドリング            | error.tsx + toast通知、ActionResult型                                | [x]    |
| XI. コード規約                   | 命名規則遵守、ESLint/Prettier設定                                    | [x]    |
| XII. 実装後レビュー              | pr-review-toolkitでレビュー実行                                      | [x]    |

## Project Structure

### Documentation (this feature)

```text
specs/001-study-log-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/              # 認証関連ページ
│   │   ├── login/           # ログイン（マジックリンク要求）
│   │   └── verify/          # マジックリンク検証
│   ├── (dashboard)/         # ダッシュボード（要認証）
│   │   ├── page.tsx         # ダッシュボード（統計・ストリーク）
│   │   ├── logs/            # 学習記録一覧・作成・編集
│   │   ├── timer/           # ポモドーロタイマー
│   │   ├── badges/          # バッジ一覧
│   │   └── export/          # PDF出力
│   ├── api/
│   │   └── auth/[...all]/   # Better Auth API routes
│   ├── layout.tsx
│   ├── page.tsx             # ランディングページ
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── study-log/           # 学習記録関連UI
│   ├── timer/               # タイマー関連UI
│   ├── badge/               # バッジ関連UI
│   └── dashboard/           # ダッシュボード関連UI
├── views/
│   ├── auth/                # 認証Container
│   ├── dashboard/           # ダッシュボードContainer
│   ├── study-log/           # 学習記録Container
│   ├── timer/               # タイマーContainer
│   └── badge/               # バッジContainer
├── actions/
│   ├── auth.ts              # 認証アクション
│   ├── study-log.ts         # 学習記録CRUD
│   ├── pomodoro.ts          # ポモドーロ記録
│   ├── badge.ts             # バッジ付与・取得
│   └── export.ts            # PDF出力
├── services/                # ビジネスロジック（DI）
│   ├── study-log.ts
│   ├── pomodoro.ts
│   ├── badge.ts
│   ├── streak.ts
│   └── pdf.ts
├── lib/
│   ├── auth.ts              # Better Auth設定
│   ├── db.ts                # Prisma client
│   ├── utils.ts
│   └── validations/         # Zodスキーマ
│       ├── study-log.ts
│       └── auth.ts
├── hooks/
│   ├── useTimer.ts          # タイマーロジック
│   └── useStreak.ts         # ストリーク取得
├── types/
│   └── index.ts
└── styles/
    └── globals.css

prisma/
├── schema.prisma
└── migrations/

tests/
├── integration/             # Testcontainers統合テスト
└── setup.ts
```

**Structure Decision**: Constitution準拠のApp Router構造。認証・ダッシュボードをRoute Groupsで分離。Server ActionsでCRUD、ServicesでDIパターンを採用。

## Design System

### Neobrutalism スタイル

大胆で遊び心のあるNeobrutalism（ネオブルータリズム）を採用。

**Tailwind CSS カスタム設定**:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: '#FFFEF0',
      primary: { DEFAULT: '#FF6B6B', foreground: '#000000' },
      secondary: { DEFAULT: '#4ECDC4', foreground: '#000000' },
      accent: { DEFAULT: '#FFE66D', foreground: '#000000' },
      border: '#000000',
    },
    boxShadow: {
      'brutal': '4px 4px 0px 0px #000000',
      'brutal-lg': '8px 8px 0px 0px #000000',
      'brutal-sm': '2px 2px 0px 0px #000000',
    },
    borderWidth: {
      '3': '3px',
    },
  }
}
```

**共通コンポーネントスタイル**:

```css
/* Neobrutalism Card */
.neo-card {
  @apply border-3 border-black bg-white shadow-brutal
         hover:shadow-brutal-lg active:shadow-brutal-sm
         transition-shadow duration-150;
}

/* Neobrutalism Button */
.neo-button {
  @apply border-3 border-black font-bold shadow-brutal
         hover:shadow-brutal-lg active:shadow-brutal-sm
         active:translate-x-1 active:translate-y-1
         transition-all duration-150;
}
```

### Bento Grid レイアウト

ダッシュボードはCSS Gridで実装。

```typescript
// components/dashboard/BentoGrid.tsx
<div className="grid grid-cols-3 gap-4 auto-rows-[120px]">
  {/* ストリーク (2x2) */}
  <div className="neo-card col-span-2 row-span-2 p-6">
    <StreakCard />
  </div>

  {/* タイマー (1x2) */}
  <div className="neo-card row-span-2 p-4">
    <TimerCard />
  </div>

  {/* 累計学習 (1x1) */}
  <div className="neo-card p-4 bg-accent">
    <StatCard label="累計学習" value={totalMinutes} />
  </div>

  {/* 累計ポモドーロ (1x1) */}
  <div className="neo-card p-4 bg-secondary">
    <StatCard label="ポモドーロ" value={totalPomodoros} />
  </div>

  {/* 最近のバッジ (1x2) */}
  <div className="neo-card row-span-2 p-4">
    <RecentBadges />
  </div>

  {/* 今日の学習 (2x1) */}
  <div className="neo-card col-span-2 p-4 bg-primary/20">
    <TodayLogCard />
  </div>
</div>
```

**レスポンシブ対応**:
- Desktop (lg): 3カラム
- Tablet (md): 2カラム
- Mobile (sm): 1カラム（スタック表示）

## Complexity Tracking

> No violations - all principles followed.
