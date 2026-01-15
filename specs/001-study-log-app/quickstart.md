# Quickstart Guide: 学習管理アプリ

**Date**: 2026-01-15
**Feature**: 001-study-log-app

このガイドは開発環境のセットアップ手順を説明します。

---

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (PostgreSQL用)

---

## 1. 環境セットアップ

### 1.1 リポジトリクローン

```bash
git clone <repository-url>
cd study-log-app-for-webinar
git checkout 001-study-log-app
```

### 1.2 依存関係インストール

```bash
pnpm install
```

### 1.3 環境変数設定

```bash
cp .env.example .env.local
```

`.env.local` を編集:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5437/studylog?schema=public"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend) - 本番用
RESEND_API_KEY="re_xxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 1.4 データベース起動

```bash
docker compose up -d
```

### 1.5 データベースマイグレーション

```bash
pnpm db:generate
pnpm db:migrate
```

### 1.6 シードデータ投入（バッジ定義）

```bash
pnpm db:seed
```

---

## 2. 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000 でアクセス可能。

---

## 3. テスト実行

### 全テスト

```bash
pnpm test
```

### コンポーネントテストのみ

```bash
pnpm test src/
```

### 統合テストのみ

```bash
pnpm test tests/
```

### カバレッジレポート

```bash
pnpm test --coverage
```

---

## 4. 開発フロー

### 4.1 TDD サイクル

Constitution I準拠: Red-Green-Refactor

```bash
# 1. テストを書く
# 2. テスト実行（失敗を確認）
pnpm test path/to/file.test.ts

# 3. 実装
# 4. テスト実行（成功を確認）
pnpm test path/to/file.test.ts

# 5. リファクタリング
```

### 4.2 コード品質チェック

```bash
pnpm lint        # ESLint
pnpm format      # Prettier
pnpm typecheck   # TypeScript
```

### 4.3 shadcn/ui コンポーネント追加

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add toast
# 必要に応じて追加
```

---

## 5. 主要ファイル一覧

| ファイル | 説明 |
|---------|------|
| `prisma/schema.prisma` | データベーススキーマ |
| `src/lib/auth.ts` | Better Auth設定 |
| `src/lib/db.ts` | Prisma Client |
| `src/actions/*.ts` | Server Actions |
| `src/services/*.ts` | ビジネスロジック |
| `src/components/ui/*` | shadcn/ui |
| `src/views/*` | Container Components |

---

## 6. トラブルシューティング

### データベース接続エラー

```bash
# Dockerが起動しているか確認
docker ps

# 起動していなければ
docker compose up -d

# ポート確認（5437を使用）
docker compose ps
```

### Prisma Client エラー

```bash
# クライアント再生成
pnpm db:generate
```

### マジックリンクが届かない（開発環境）

開発環境ではメールは送信されず、コンソールにURLが出力されます。
ターミナルの出力を確認してください。

```
[DEV] Magic link for test@example.com: http://localhost:3000/verify?token=xxx
```

---

## 7. 便利なコマンド

```bash
# Prisma Studio（DBビューア）
pnpm dlx prisma studio

# データベースリセット
pnpm db:push --force-reset

# マイグレーション作成
pnpm prisma migrate dev --name add_new_field

# 型チェック + リント + テスト
pnpm lint && pnpm typecheck && pnpm test
```

---

## 8. 次のステップ

1. `/speckit.tasks` でタスクを生成
2. タスクに従ってTDD実装を開始
3. 実装完了後は `pr-review-toolkit` でレビュー
