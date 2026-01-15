<!--
  SYNC IMPACT REPORT
  ==================
  Version change: N/A → 1.0.0 (Initial ratification)

  Added Principles (12 total):
  - I. Test-Driven Development (TDD) - 必須
  - II. Presentational Component分離
  - III. デザインシステム厳格運用
  - IV. Next.js ベストプラクティス
  - V. Server Actions & API設計
  - VI. 型安全性とバリデーション
  - VII. 認証・セキュリティ
  - VIII. フォーム管理 (useActionState基本、react-hook-form optional)
  - IX. 状態管理 (Server Components + props基本、Jotai optional)
  - X. エラーハンドリング
  - XI. コード規約
  - XII. 実装後レビュー

  Added Sections:
  - 技術スタック
  - デザインシステム規約
  - ディレクトリ構造
  - Governance

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ 整合性確認済み
  - .specify/templates/spec-template.md ✅ 整合性確認済み
  - .specify/templates/tasks-template.md ✅ 整合性確認済み

  Follow-up TODOs: None
-->

# Vibe Template Constitution

## Core Principles

### I. Test-Driven Development (TDD) - 必須

テスト駆動開発は本プロジェクトにおいて**非交渉事項**である。

- **Red-Green-Refactor**: テストを先に書く → 失敗を確認 → 実装 → リファクタリング
- **テストの種類**:
  - React Testing Library (RTL) によるコンポーネントテスト
  - API テスト（Server Actions/API Routes の統合テスト）
- **テストファイル配置**: 対象ファイルと同階層に `*.test.ts` / `*.test.tsx` を配置
- **カバレッジ目標**: 新規コードは80%以上のカバレッジを維持

**根拠**: TDDにより設計品質が向上し、リグレッションを防止。テストが仕様書として機能する。

### II. Presentational Component分離

UIコンポーネントは**Presentational Component**と**Container Component**に厳格に分離する。

- **Presentational Component**:
  - `src/components/` に配置
  - propsのみに依存、副作用なし
  - ビジネスロジックを含まない
  - Storybook対応可能な純粋なUIコンポーネント
- **Container Component (Views)**:
  - `src/views/` に配置
  - データ取得、状態管理、Server Actionsの呼び出しを担当
  - Presentational Componentを組み合わせて使用

**根拠**: 関心の分離により再利用性・テスト容易性・保守性が向上。

### III. デザインシステム厳格運用

デザインの一貫性を保つため、以下のルールを**厳格に適用**する。

#### 色彩ルール

- **Primary色**: テーマ設定可能（`tailwind.config.ts` の `theme.extend.colors` で定義）
- **グレースケール**: 9段階 (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- **セマンティックカラー**:
  - `success`: 緑系 (hsl定義)
  - `warning`: 黄/オレンジ系
  - `error/destructive`: 赤系
  - `info`: 青系
- **コントラスト比**: WCAG AA準拠（通常テキスト 4.5:1、大テキスト 3:1）

#### タイポグラフィ（ジャンプ率）

フォントサイズは**1.250（Major Third）**のスケールに従う：

| Token       | Size            | Line Height | 用途               |
| ----------- | --------------- | ----------- | ------------------ |
| `text-xs`   | 12px (0.75rem)  | 1.5         | キャプション、補足 |
| `text-sm`   | 14px (0.875rem) | 1.5         | 小さめの本文       |
| `text-base` | 16px (1rem)     | 1.5         | 本文               |
| `text-lg`   | 18px (1.125rem) | 1.4         | 強調テキスト       |
| `text-xl`   | 20px (1.25rem)  | 1.4         | 小見出し           |
| `text-2xl`  | 24px (1.5rem)   | 1.3         | 見出しH3           |
| `text-3xl`  | 30px (1.875rem) | 1.25        | 見出しH2           |
| `text-4xl`  | 36px (2.25rem)  | 1.2         | 見出しH1           |
| `text-5xl`  | 48px (3rem)     | 1.1         | ヒーローテキスト   |

#### スペーシング（マージン比率）

**4pxベースグリッド**を使用し、8の倍数を推奨：

| Token      | Value | 用途                   |
| ---------- | ----- | ---------------------- |
| `space-1`  | 4px   | 最小間隔               |
| `space-2`  | 8px   | 要素内パディング（小） |
| `space-3`  | 12px  | 要素内パディング（中） |
| `space-4`  | 16px  | 要素間マージン（小）   |
| `space-6`  | 24px  | 要素間マージン（中）   |
| `space-8`  | 32px  | セクション間（小）     |
| `space-12` | 48px  | セクション間（中）     |
| `space-16` | 64px  | セクション間（大）     |
| `space-24` | 96px  | ページセクション間     |

**コンポーネント内パディング規則**:

- カード: `p-4` または `p-6`
- ボタン: `px-4 py-2` (default), `px-3 py-1.5` (sm), `px-6 py-3` (lg)
- 入力フィールド: `px-3 py-2`

**根拠**: 統一されたスケールにより視覚的な一貫性を確保。デザインの判断を減らし実装速度を向上。

### IV. Next.js ベストプラクティス

App Routerのベストプラクティスに従う。

- **ディレクトリ構造**: 下記「ディレクトリ構造」セクション参照
- **Server Components**: デフォルトでServer Component。クライアント機能が必要な場合のみ`'use client'`
- **Data Fetching**: Server Componentsで直接データ取得。クライアントからはServer Actionsを使用
- **Loading/Error States**: `loading.tsx`, `error.tsx`, `not-found.tsx` を適切に配置
- **Metadata**: 各ページに適切なmetadataを設定
- **Route Groups**: `(auth)`, `(dashboard)` などで論理的にグループ化

**根拠**: Next.jsの設計思想に沿うことでパフォーマンスとDXを最大化。

### V. Server Actions & API設計

- **Server Actions**: フォーム送信、データ変更操作に使用（**基本方針**）
- **API Routes**: Webhook等の外部連携のみに限定。通常のデータ操作はServer Actionsを使用
- **配置**: `src/actions/` ディレクトリに機能別に配置（例: `auth.ts`, `user.ts`）
- **バリデーション**: Zodによる入力バリデーションを必須とする
- **エラーハンドリング**: 統一されたエラーレスポンス形式を使用
- **戻り値型**: `ActionResult<T>` 型を使用し成功/失敗を明示

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

**根拠**: Server Actionsにより型安全なサーバー通信を実現。RPCライクなシンプルなAPI。

### VI. 型安全性とバリデーション

- **Zod**: すべての外部入力（フォーム、API）のバリデーションに使用
- **Prisma**: データベーススキーマから型を自動生成
- **TypeScript Strict Mode**: 有効化必須
- **型推論**: 可能な限り型推論を活用し、冗長な型注釈を避ける

**根拠**: ランタイムエラーをコンパイル時に検出し、堅牢なアプリケーションを構築。

### VI-b. 自動生成コマンドの活用

公式CLIや生成コマンドがあるツールは、**0から手書きせず生成コマンドを使用**する。

| ツール      | コマンド例                                                            |
| ----------- | --------------------------------------------------------------------- |
| Prisma      | `pnpm prisma init`, `pnpm prisma generate`, `pnpm prisma migrate dev` |
| Better Auth | `pnpm dlx @better-auth/cli generate`                                  |
| shadcn/ui   | `pnpm dlx shadcn@latest add [component]`                              |
| Next.js     | `pnpm create next-app`                                                |

**根拠**: 公式コマンドにより正しい設定・ボイラープレートを確実に生成し、ヒューマンエラーを防止。

### VII. 認証・セキュリティ

- **Better Auth**: 認証ライブラリとして使用
- **セッション管理**: サーバーサイドセッションを使用
- **CSRF保護**: Server Actionsで自動的に保護
- **入力サニタイズ**: すべてのユーザー入力をバリデーション・サニタイズ

**根拠**: Better Authにより安全で柔軟な認証を実現。

### VIII. フォーム管理

- **基本方針**: Server Actions + `useActionState` を使用
- **Zodバリデーション**: Server Action内でZodスキーマによるバリデーション
- **react-hook-form（必要な場合のみ）**: 複雑なフォーム、リアルタイムバリデーション、動的フィールド

```typescript
// 基本パターン: Server Actions + useActionState
'use client'
import { useActionState } from 'react'
import { createUserAction } from '@/actions/user'

function Form() {
  const [state, action, pending] = useActionState(createUserAction, null)

  return (
    <form action={action}>
      <input name="email" />
      {state?.fieldErrors?.email && <p>{state.fieldErrors.email}</p>}
      <button disabled={pending}>Submit</button>
    </form>
  )
}
```

**根拠**: Server Actionsにより状態管理を最小化し、プログレッシブエンハンスメントを実現。

### IX. 状態管理

- **データフェッチ**: SWRを使用してクライアント側でデータ取得・キャッシュ管理
- **クライアント状態**: `useState` で局所的に管理（最小限に）
- **Jotai（必要な場合のみ）**: 複数コンポーネント間で共有が必要なUI状態（テーマ、モーダル等）

```typescript
// SWRでデータフェッチ
import useSWR from 'swr'
import { getUsers, createUserAction, deleteUser } from '@/actions/user'

function UserPageView() {
  const { data: users, error, isLoading, mutate } = useSWR('users', getUsers)

  const handleCreate = async (formData: FormData) => {
    const result = await createUserAction(prevState, formData)
    if (result.success) {
      mutate() // キャッシュを更新 → 自動で再フェッチ
    }
    return result
  }

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    mutate()
  }
}

// 必要な場合のみJotai（例: テーマ切り替え）
// src/stores/theme.ts
export const themeAtom = atom<'light' | 'dark'>('light')
```

**根拠**: SWRによりキャッシュ管理・再フェッチ・ローディング状態が自動化され、手動のstate管理が不要になる。

### X. エラーハンドリング

- **Error Boundary**: `error.tsx` でページレベルのエラーをキャッチ
- **トースト通知**: shadcn/ui の `toast` コンポーネントを使用
- **フォームエラー**: フィールドレベルのエラー表示
- **グローバルエラー**: 予期しないエラーは `error.tsx` で処理

```typescript
// Server Action エラーハンドリングパターン
const result = await serverAction(data)
if (!result.success) {
  if (result.fieldErrors) {
    // フィールドエラーをフォームに設定
    Object.entries(result.fieldErrors).forEach(([field, errors]) => {
      form.setError(field, { message: errors[0] })
    })
  } else {
    // グローバルエラーをトーストで表示
    toast.error(result.error)
  }
}
```

**根拠**: 適切なエラーハンドリングによりユーザー体験を向上し、デバッグを容易にする。

### XI. コード規約

#### 命名規則

| 対象                | 規則                      | 例                                        |
| ------------------- | ------------------------- | ----------------------------------------- |
| コンポーネント      | PascalCase                | `UserProfile.tsx`                         |
| フック              | camelCase + use prefix    | `useAuth.ts`                              |
| ユーティリティ      | camelCase                 | `formatDate.ts`                           |
| 定数                | SCREAMING_SNAKE_CASE      | `MAX_RETRY_COUNT`                         |
| 型/インターフェース | PascalCase                | `UserData`, `AuthState`                   |
| Zodスキーマ         | camelCase + Schema suffix | `userSchema`, `loginFormSchema`           |
| Server Actions      | camelCase + Action suffix | `createUserAction`, `updateProfileAction` |
| Jotai Atom          | camelCase + Atom suffix   | `userAtom`, `themeAtom`                   |

#### ESLint/Prettier

- **ESLint**: `@typescript-eslint` + `eslint-plugin-react-hooks`
- **Prettier**: シングルクォート、セミコロンなし、末尾カンマあり
- **インポート順序**: React → 外部ライブラリ → 内部モジュール → 型

```javascript
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

**根拠**: 一貫したコードスタイルにより可読性を向上し、レビュー負担を軽減。

### XII. 実装後レビュー

機能実装完了後は、以下のプラグインレビューツールを**必ず実行**する：

- `pr-review-toolkit:code-reviewer` - コードレビュー
- `pr-review-toolkit:comment-analyzer` - コメント分析
- `pr-review-toolkit:silent-failure-hunter` - サイレントエラー検出
- `pr-review-toolkit:type-design-analyzer` - 型設計分析

**根拠**: 自動レビューにより品質を担保し、人的レビューの負担を軽減。

## 技術スタック

| カテゴリ         | 技術                                        | 用途                            |
| ---------------- | ------------------------------------------- | ------------------------------- |
| Package Manager  | pnpm                                        | パッケージ管理                  |
| Framework        | Next.js (App Router)                        | フルスタックReactフレームワーク |
| Styling          | Tailwind CSS                                | ユーティリティファーストCSS     |
| UI Components    | shadcn/ui                                   | アクセシブルなUIコンポーネント  |
| Validation       | Zod                                         | スキーマ検証                    |
| Form             | useActionState + react-hook-form (optional) | フォーム状態管理                |
| Data Fetching    | SWR                                         | データフェッチ・キャッシュ管理  |
| State Management | Jotai (optional)                            | グローバルUI状態（必要時のみ）  |
| ORM              | Prisma                                      | データベースアクセス            |
| Authentication   | Better Auth                                 | 認証・認可                      |
| Payment          | Stripe                                      | 課金・決済                      |
| Testing          | Vitest + RTL                                | ユニット・コンポーネントテスト  |
| Linting          | ESLint + Prettier                           | コード品質・フォーマット        |

## デザインシステム規約

### テーマ設定

テーマカラーは `tailwind.config.ts` で設定可能。プロジェクト開始時にユーザーが指定したテーマを使用：

```typescript
// tailwind.config.ts での設定例
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... その他のカラー定義
    }
  }
}
```

### デザインエージェント

UIデザイン作業には `.claude/agents/ui-ux-designer.md` で定義されたUI/UXデザイナーエージェントを使用する：

- ユーザー中心設計
- アクセシビリティ（WCAG AA準拠）
- レスポンシブデザイン（モバイルファースト）
- 一貫したデザインパターン

## ディレクトリ構造

```
src/
├── app/                    # App Router
│   ├── (auth)/            # 認証関連ページ (Route Group)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # ダッシュボード (Route Group)
│   ├── api/               # API Routes (Webhook等の外部連携のみ、通常はServer Actionsを使用)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/            # Presentational Components
│   ├── ui/               # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── [feature]/        # 機能別の再利用可能UIコンポーネント
├── views/                 # Container Components (データ取得・状態管理)
│   ├── auth/
│   └── dashboard/
├── actions/               # Server Actions
│   ├── auth.ts
│   └── ...
├── lib/                   # ユーティリティ・設定
│   ├── auth.ts           # Better Auth設定
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # ユーティリティ関数
│   └── validations/      # Zodスキーマ
├── stores/                # Jotai atoms（必要な場合のみ作成）
├── hooks/                 # カスタムフック
├── types/                 # 型定義
└── styles/               # グローバルスタイル
    └── globals.css

prisma/
├── schema.prisma
└── migrations/

tests/                     # テスト設定
└── setup.ts
```

## Governance

### 憲法の優先度

本Constitutionはプロジェクトのすべての開発慣行に優先する。

### 修正手順

1. 修正提案をドキュメント化
2. チームレビューと承認
3. 移行計画の策定（破壊的変更の場合）
4. バージョン番号の更新（セマンティックバージョニング）
5. 関連テンプレートの更新

### コンプライアンス

- すべてのPR/レビューは本Constitutionへの準拠を確認する
- 複雑さの追加は正当化が必要
- 開発ガイダンスには `.specify/` 配下のドキュメントを参照

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
