# Tasks: 開発環境セットアップ

**Input**: Design documents from `/specs/001-dev-environment/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: テスト駆動開発(TDD)は**必須**。Red-Green-Refactorサイクルに従い、テストを先に書いてから実装する。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Next.js プロジェクトの初期化と基本構造の作成

- [x] T001 Initialize Next.js project with `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] T002 Create .nvmrc file with Node.js version `20` in project root
- [x] T003 Add engines field to package.json requiring Node.js >= 20.0.0

---

## Phase 2: Foundational (Core Configuration)

**Purpose**: 全ユーザーストーリーの前提となるコア設定

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Install Vitest and testing dependencies with `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [x] T005 [P] Create vitest.config.ts in project root with React plugin and jsdom environment
- [x] T006 [P] Create tests/setup.ts with testing-library/jest-dom imports
- [x] T007 [P] Install Prettier dependencies with `pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier`
- [x] T008 [P] Create .prettierrc in project root with constitution.md settings (semi: false, singleQuote: true, trailingComma: es5)
- [x] T009 [P] Create .prettierignore in project root
- [x] T010 Update .eslintrc.json to extend prettier config
- [x] T011 Install Prisma with `pnpm add prisma @prisma/client`
- [x] T012 Initialize Prisma with `pnpm prisma init`
- [x] T013 [P] Create .env.example with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL placeholders
- [x] T014 Update .gitignore to include .env.local and Prisma artifacts
- [x] T015 Initialize shadcn/ui with `pnpm dlx shadcn@latest init`
- [x] T016 Create directory structure: src/components/ui/, src/views/, src/actions/, src/lib/validations/, src/hooks/, src/types/, src/stores/

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 初回環境構築 (Priority: P1) 🎯 MVP

**Goal**: 新規開発者が最小限のコマンドで開発環境を立ち上げられる

**Independent Test**: `pnpm install` 実行後、依存関係がインストールされ、`.env.example` が存在することを確認

### Tests for User Story 1 (TDD必須) ⚠️

- [x] T017 [P] [US1] Create sample component test in src/components/ui/Button.test.tsx to verify test setup works
- [x] T018 [P] [US1] Create test for environment variable validation (placeholder) in src/lib/env.test.ts

### Implementation for User Story 1

- [x] T019 [P] [US1] Create src/lib/db.ts with Prisma client singleton pattern
- [x] T020 [P] [US1] Create src/lib/utils.ts with cn() utility function for Tailwind class merging
- [x] T021 [US1] Add npm scripts to package.json: dev, build, start, lint, lint:fix, format, format:check, typecheck, test, test:ui, test:coverage, db:generate, db:migrate, db:push, db:studio
- [x] T022 [US1] Verify `pnpm install` completes successfully
- [x] T023 [US1] Verify `.env.example` contains all required environment variables

**Checkpoint**: User Story 1 complete - developers can clone and install dependencies

---

## Phase 4: User Story 2 - ローカル開発サーバー起動 (Priority: P1)

**Goal**: 開発者がホットリロード対応の開発サーバーを起動できる

**Independent Test**: `pnpm dev` 実行後、localhost:3000 でアプリケーションにアクセスできることを確認

### Tests for User Story 2 (TDD必須) ⚠️

- [x] T024 [P] [US2] Create test for page component rendering in src/app/page.test.tsx

### Implementation for User Story 2

- [x] T025 [US2] Update src/app/page.tsx with minimal welcome content
- [x] T026 [P] [US2] Create src/app/loading.tsx with loading indicator
- [x] T027 [P] [US2] Create src/app/error.tsx with error boundary component
- [x] T028 [P] [US2] Create src/app/not-found.tsx with 404 page
- [x] T029 [US2] Verify `pnpm dev` starts development server on port 3000
- [x] T030 [US2] Verify hot reload works by modifying src/app/page.tsx

**Checkpoint**: User Story 2 complete - development server runs with hot reload

---

## Phase 5: User Story 3 - コード品質チェック (Priority: P2)

**Goal**: 開発者がリンター・フォーマッターを実行してコード品質を担保できる

**Independent Test**: 意図的にフォーマットを崩したコードに対して `pnpm lint` と `pnpm format:check` を実行し、問題が検出されることを確認

### Implementation for User Story 3

- [x] T031 [US3] Verify `pnpm lint` detects code style issues
- [x] T032 [US3] Verify `pnpm lint:fix` auto-fixes fixable issues
- [x] T033 [US3] Verify `pnpm format` formats all files according to .prettierrc
- [x] T034 [US3] Verify `pnpm format:check` reports unformatted files
- [x] T035 [US3] Verify `pnpm typecheck` reports TypeScript errors

**Checkpoint**: User Story 3 complete - linting and formatting work correctly

---

## Phase 6: User Story 4 - テスト実行 (Priority: P2)

**Goal**: 開発者がユニットテストを実行できる

**Independent Test**: `pnpm test` 実行後、テスト結果が表示されることを確認

### Implementation for User Story 4

- [x] T036 [US4] Verify `pnpm test` runs all test files and shows results
- [x] T037 [US4] Verify `pnpm test:ui` opens Vitest UI in browser
- [x] T038 [US4] Verify `pnpm test:coverage` generates coverage report
- [x] T039 [US4] Verify specific test file can be run with `pnpm test src/components/ui/Button.test.tsx`

**Checkpoint**: User Story 4 complete - testing infrastructure works correctly

---

## Phase 7: User Story 5 - ビルド実行 (Priority: P3)

**Goal**: 開発者が本番用ビルドを生成できる

**Independent Test**: `pnpm build` 実行後、.next/ ディレクトリにビルド成果物が生成されることを確認

### Implementation for User Story 5

- [x] T040 [US5] Verify `pnpm build` completes without errors
- [x] T041 [US5] Verify .next/ directory contains build artifacts
- [x] T042 [US5] Verify `pnpm start` serves the production build

**Checkpoint**: User Story 5 complete - production build works correctly

---

## Phase 8: Polish & Documentation

**Purpose**: ドキュメント整備と最終検証

- [x] T043 [P] Create README.md with setup instructions based on quickstart.md
- [x] T044 [P] Update package.json description and repository fields
- [x] T045 Run full validation: `pnpm install && pnpm dev` (verify in under 5 minutes)
- [x] T046 Run `pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build` to verify all commands work
- [x] T047 Execute pr-review-toolkit code review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Uses config from US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Uses ESLint/Prettier from Foundational
- **User Story 4 (P2)**: Can start after Foundational - Uses Vitest from Foundational
- **User Story 5 (P3)**: Can start after Foundational - Uses Next.js build from Setup

### Parallel Opportunities

**Phase 2 (Foundational)**:

```
T005, T006, T007, T008, T009 can run in parallel
```

**Phase 3 (US1)**:

```
T017, T018, T019, T020 can run in parallel
```

**Phase 4 (US2)**:

```
T024, T026, T027, T028 can run in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T016)
3. Complete Phase 3: User Story 1 (T017-T023)
4. Complete Phase 4: User Story 2 (T024-T030)
5. **STOP and VALIDATE**: Developers can now clone, install, and run dev server

### Incremental Delivery

1. Setup + Foundational → Core infrastructure ready
2. Add US1 + US2 → Developers can start coding (MVP!)
3. Add US3 → Code quality checks available
4. Add US4 → Testing infrastructure complete
5. Add US5 → Production deployment ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
