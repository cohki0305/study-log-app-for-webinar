# Research: 開発環境セットアップ

**Feature**: 001-dev-environment
**Date**: 2026-01-13

## 1. Next.js プロジェクト初期化

### Decision

`pnpm create next-app@latest` を使用して Next.js 14+ (App Router) プロジェクトを初期化する。

### Rationale

- 公式CLIにより正しいプロジェクト構造が保証される
- TypeScript、Tailwind CSS、ESLint の初期設定が自動化される
- App Router がデフォルトで有効化される

### Alternatives Considered

- 手動セットアップ: 設定ミスのリスクが高い
- テンプレートリポジトリ: メンテナンスコストが発生

### 推奨オプション

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

---

## 2. Vitest + React Testing Library 設定

### Decision

Vitest をテストランナーとして使用し、React Testing Library でコンポーネントテストを行う。

### Rationale

- Vitest は Vite ベースで高速、ESM ネイティブ対応
- Jest 互換 API により学習コストが低い
- React Testing Library は React 公式推奨

### Alternatives Considered

- Jest: 設定が複雑、ESM サポートが限定的
- Playwright: E2E向け、ユニットテストには過剰

### 必要パッケージ

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 3. ESLint + Prettier 設定

### Decision

Next.js 標準の ESLint 設定をベースに、Prettier を追加してコードフォーマットを統一する。

### Rationale

- constitution.md で定義されたコード規約に準拠
- ESLint と Prettier の競合を eslint-config-prettier で解消
- シングルクォート、セミコロンなし、末尾カンマありのスタイル

### Alternatives Considered

- Biome: 高速だがエコシステムが限定的
- dprint: Prettier ほど普及していない

### 必要パッケージ

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

### Prettier 設定 (.prettierrc)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

---

## 4. shadcn/ui 初期化

### Decision

shadcn/ui を使用してアクセシブルな UI コンポーネントを提供する。

### Rationale

- Tailwind CSS ベースで constitution.md のデザインシステムと親和性が高い
- コンポーネントはコピーされるためカスタマイズが容易
- アクセシビリティが考慮されている

### 初期化コマンド

```bash
pnpm dlx shadcn@latest init
```

---

## 5. Prisma 初期化

### Decision

Prisma ORM を使用してデータベースアクセスを型安全に行う。

### Rationale

- TypeScript との統合が優れている
- マイグレーション管理が容易
- constitution.md で指定されたツール

### 初期化コマンド

```bash
pnpm add prisma @prisma/client
pnpm prisma init
```

---

## 6. 環境変数管理

### Decision

`.env.example` をテンプレートとして提供し、開発者が `.env.local` にコピーして使用する。

### Rationale

- Next.js の標準的なパターン
- 秘密情報をリポジトリにコミットしない
- 必要な環境変数が明確になる

### 必須環境変数

```
# Database
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Optional: External Services
# STRIPE_SECRET_KEY=
```

---

## 7. npm scripts 設計

### Decision

package.json に標準的な npm scripts を定義する。

### Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

---

## 8. Node.js バージョン管理

### Decision

`.nvmrc` ファイルで推奨 Node.js バージョンを明示する。

### Rationale

- nvm/fnm ユーザーが簡単にバージョンを切り替えられる
- package.json の engines フィールドでも制約を設定

### 設定

```
# .nvmrc
20
```

```json
// package.json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

## Summary

すべての技術的決定は constitution.md に基づいており、NEEDS CLARIFICATION 項目はありません。
