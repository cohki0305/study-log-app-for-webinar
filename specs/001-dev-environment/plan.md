# Implementation Plan: 開発環境セットアップ

**Branch**: `001-dev-environment` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dev-environment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Next.js (App Router) ベースのフルスタックWebアプリケーション開発環境を構築する。pnpmによる依存関係管理、Vitest + RTLによるテスト、ESLint + Prettierによるコード品質管理を含む。新規開発者が5分以内に開発を開始できる環境を目指す。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Framework**: Next.js 14+ (App Router)
**Package Manager**: pnpm
**Primary Dependencies**: Tailwind CSS, shadcn/ui, Zod, Prisma, Better Auth
**Storage**: PostgreSQL (via Prisma ORM)
**Testing**: Vitest + React Testing Library (RTL)
**Linting/Formatting**: ESLint + Prettier
**Target Platform**: Web (Modern browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: 開発サーバー起動後、コード変更が3秒以内にブラウザに反映
**Constraints**: constitution.mdに定義された技術スタックとコード規約に準拠
**Scale/Scope**: 単一開発者〜小規模チーム向けの開発環境

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                        | Requirement                                                          | Status | Notes                    |
| -------------------------------- | -------------------------------------------------------------------- | ------ | ------------------------ |
| I. TDD                           | テストを先に書いてから実装する                                       | [x]    | Vitest + RTL設定を含む   |
| II. Presentational Component分離 | Presentationalはsrc/components/、Containerはsrc/views/に配置         | [x]    | ディレクトリ構造で対応   |
| III. デザインシステム            | 色彩・タイポグラフィ・スペーシングルールに準拠                       | [x]    | Tailwind CSS設定で対応   |
| IV. Next.js ベストプラクティス   | App Router、Server Components優先、Route Groups使用                  | [x]    | App Router構造を採用     |
| V. Server Actions                | Server Actions基本、API RoutesはWebhook等のみ、Zodバリデーション必須 | [x]    | ディレクトリ構造で対応   |
| VI. 型安全性                     | TypeScript Strict Mode、Prisma型活用                                 | [x]    | tsconfig.json設定        |
| VII. 認証                        | Better Auth使用、CSRF保護                                            | [-]    | 開発環境では設定のみ     |
| VIII. フォーム管理               | useActionState基本、react-hook-formは複雑なフォームのみ              | [-]    | 開発環境では対象外       |
| IX. 状態管理                     | Server Components + props基本、Jotaiは必要時のみ                     | [-]    | 開発環境では対象外       |
| X. エラーハンドリング            | error.tsx + toast通知、ActionResult型                                | [x]    | テンプレートファイル配置 |
| XI. コード規約                   | 命名規則遵守、ESLint/Prettier設定                                    | [x]    | ESLint + Prettier設定    |
| XII. 実装後レビュー              | pr-review-toolkitでレビュー実行                                      | [x]    | 完了後に実行予定         |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  Next.js App Router プロジェクト構造（Constitution準拠）
-->

```text
src/
├── app/                    # App Router
│   ├── (auth)/            # 認証関連ページ (Route Group)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # ダッシュボード (Route Group)
│   ├── api/               # API Routes (Webhook等の外部連携のみ)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/            # Presentational Components
│   ├── ui/               # shadcn/ui コンポーネント
│   └── [feature]/        # 機能別の再利用可能UIコンポーネント
├── views/                 # Container Components (データ取得・状態管理)
├── actions/               # Server Actions
├── lib/                   # ユーティリティ・設定
│   ├── auth.ts           # Better Auth設定
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # ユーティリティ関数
│   └── validations/      # Zodスキーマ
├── stores/                # Jotai atoms（必要な場合のみ）
├── hooks/                 # カスタムフック
├── types/                 # 型定義
└── styles/               # グローバルスタイル

prisma/
├── schema.prisma
└── migrations/

tests/                     # テスト設定
└── setup.ts
```

**Structure Decision**: Constitution.md で定義された Next.js App Router 構造を採用。Presentational/Container 分離パターンに従い、src/components/ と src/views/ を明確に分離。テストファイルは対象ファイルと同階層に配置（例: `Button.tsx` → `Button.test.tsx`）。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
