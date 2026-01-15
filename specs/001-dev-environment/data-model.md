# Data Model: 開発環境セットアップ

**Feature**: 001-dev-environment
**Date**: 2026-01-13

## Overview

開発環境セットアップはアプリケーションのデータモデルではなく、プロジェクト構成ファイルと設定を定義します。

## 設定ファイル構造

### ルートディレクトリ

| ファイル             | 目的                     | 必須 |
| -------------------- | ------------------------ | ---- |
| `package.json`       | 依存関係・スクリプト定義 | Yes  |
| `pnpm-lock.yaml`     | 依存関係ロックファイル   | Yes  |
| `tsconfig.json`      | TypeScript 設定          | Yes  |
| `next.config.ts`     | Next.js 設定             | Yes  |
| `tailwind.config.ts` | Tailwind CSS 設定        | Yes  |
| `postcss.config.mjs` | PostCSS 設定             | Yes  |
| `vitest.config.ts`   | Vitest テスト設定        | Yes  |
| `.eslintrc.json`     | ESLint 設定              | Yes  |
| `.prettierrc`        | Prettier 設定            | Yes  |
| `.prettierignore`    | Prettier 除外パターン    | Yes  |
| `.gitignore`         | Git 除外パターン         | Yes  |
| `.nvmrc`             | Node.js バージョン指定   | Yes  |
| `.env.example`       | 環境変数テンプレート     | Yes  |
| `components.json`    | shadcn/ui 設定           | Yes  |
| `README.md`          | プロジェクト説明         | Yes  |

### prisma/

| ファイル        | 目的                     |
| --------------- | ------------------------ |
| `schema.prisma` | データベーススキーマ定義 |

### src/

| ディレクトリ       | 目的                          | Constitution 参照 |
| ------------------ | ----------------------------- | ----------------- |
| `app/`             | App Router ページ・レイアウト | Principle IV      |
| `components/`      | Presentational Components     | Principle II      |
| `components/ui/`   | shadcn/ui コンポーネント      | Principle III     |
| `views/`           | Container Components          | Principle II      |
| `actions/`         | Server Actions                | Principle V       |
| `lib/`             | ユーティリティ・設定          | -                 |
| `lib/validations/` | Zod スキーマ                  | Principle VI      |
| `hooks/`           | カスタムフック                | -                 |
| `types/`           | 型定義                        | Principle VI      |
| `styles/`          | グローバルスタイル            | -                 |
| `stores/`          | Jotai atoms（必要時のみ）     | Principle IX      |

### tests/

| ファイル   | 目的                             |
| ---------- | -------------------------------- |
| `setup.ts` | テスト共通設定・グローバルモック |

## 環境変数スキーマ

```typescript
// src/lib/env.ts（参考）
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>
```

## 初期 Prisma スキーマ

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Better Auth 用テーブルは別途追加
```

## API コントラクト

開発環境セットアップフェーズでは API エンドポイントは定義しません。API は後続の機能実装で追加されます。

## 状態遷移

開発環境には状態遷移はありません。

---

**Note**: この機能は設定・構成のみを扱うため、アプリケーションロジックのデータモデルは含みません。
