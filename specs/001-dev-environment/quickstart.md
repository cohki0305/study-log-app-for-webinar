# Quickstart: 開発環境セットアップ

**Feature**: 001-dev-environment
**Date**: 2026-01-13

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL（ローカルまたは Docker）
- Git

## セットアップ手順

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd vibe-template
```

### 2. Node.js バージョン確認

```bash
# nvm を使用している場合
nvm use

# または手動で確認
node -v  # v20.x.x 以上であること
```

### 3. 依存関係インストール

```bash
pnpm install
```

### 4. 環境変数設定

```bash
# テンプレートをコピー
cp .env.example .env.local

# .env.local を編集して必要な値を設定
# - DATABASE_URL: PostgreSQL 接続文字列
# - BETTER_AUTH_SECRET: 32文字以上のランダム文字列
```

### 5. データベースセットアップ

```bash
# Prisma クライアント生成
pnpm db:generate

# マイグレーション実行（開発用）
pnpm db:migrate
```

### 6. 開発サーバー起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開く。

## 主要コマンド

| コマンド             | 説明                     |
| -------------------- | ------------------------ |
| `pnpm dev`           | 開発サーバー起動         |
| `pnpm build`         | 本番ビルド               |
| `pnpm start`         | 本番サーバー起動         |
| `pnpm lint`          | ESLint 実行              |
| `pnpm lint:fix`      | ESLint 自動修正          |
| `pnpm format`        | Prettier フォーマット    |
| `pnpm format:check`  | フォーマットチェック     |
| `pnpm typecheck`     | TypeScript 型チェック    |
| `pnpm test`          | テスト実行               |
| `pnpm test:ui`       | テスト UI 起動           |
| `pnpm test:coverage` | カバレッジレポート       |
| `pnpm db:generate`   | Prisma クライアント生成  |
| `pnpm db:migrate`    | マイグレーション実行     |
| `pnpm db:push`       | スキーマを DB に直接反映 |
| `pnpm db:studio`     | Prisma Studio 起動       |

## ディレクトリ構造

```
src/
├── app/           # ページ・レイアウト（App Router）
├── components/    # Presentational Components
│   └── ui/        # shadcn/ui コンポーネント
├── views/         # Container Components
├── actions/       # Server Actions
├── lib/           # ユーティリティ
├── hooks/         # カスタムフック
├── types/         # 型定義
└── styles/        # スタイル
```

## トラブルシューティング

### ポートが使用中

```bash
# 別のポートで起動
pnpm dev -- -p 3001
```

### Prisma エラー

```bash
# クライアント再生成
pnpm db:generate

# スキーマを強制的に反映（開発時のみ）
pnpm db:push --force-reset
```

### 依存関係の問題

```bash
# node_modules を削除して再インストール
rm -rf node_modules
pnpm install
```

## 次のステップ

1. `pnpm dev` で開発サーバーが起動することを確認
2. `pnpm test` でテストが実行されることを確認
3. `pnpm lint` でリントが通ることを確認
4. 機能開発を開始
