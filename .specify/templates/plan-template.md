# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node.js 20+
**Framework**: Next.js 14+ (App Router)
**Primary Dependencies**: Tailwind CSS, shadcn/ui, Zod, Prisma, Better Auth
**Storage**: PostgreSQL (via Prisma ORM)
**Testing**: Vitest + React Testing Library (RTL) + API Tests
**Target Platform**: Web (Modern browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: [domain-specific or NEEDS CLARIFICATION]
**Constraints**: [domain-specific or NEEDS CLARIFICATION]
**Scale/Scope**: [domain-specific or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                        | Requirement                                                          | Status |
| -------------------------------- | -------------------------------------------------------------------- | ------ |
| I. TDD                           | テストを先に書いてから実装する                                       | [ ]    |
| II. Presentational Component分離 | Presentationalはsrc/components/、Containerはsrc/views/に配置         | [ ]    |
| III. デザインシステム            | 色彩・タイポグラフィ・スペーシングルールに準拠                       | [ ]    |
| IV. Next.js ベストプラクティス   | App Router、Server Components優先、Route Groups使用                  | [ ]    |
| V. Server Actions                | Server Actions基本、API RoutesはWebhook等のみ、Zodバリデーション必須 | [ ]    |
| VI. 型安全性                     | TypeScript Strict Mode、Prisma型活用                                 | [ ]    |
| VII. 認証                        | Better Auth使用、CSRF保護                                            | [ ]    |
| VIII. フォーム管理               | useActionState基本、react-hook-formは複雑なフォームのみ              | [ ]    |
| IX. 状態管理                     | Server Components + props基本、Jotaiは必要時のみ                     | [ ]    |
| X. エラーハンドリング            | error.tsx + toast通知、ActionResult型                                | [ ]    |
| XI. コード規約                   | 命名規則遵守、ESLint/Prettier設定                                    | [ ]    |
| XII. 実装後レビュー              | pr-review-toolkitでレビュー実行                                      | [ ]    |

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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
