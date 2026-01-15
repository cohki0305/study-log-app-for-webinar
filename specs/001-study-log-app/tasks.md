# Tasks: 学習管理アプリ

**Input**: Design documents from `/specs/001-study-log-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/server-actions.md

**Tests**: テスト駆動開発(TDD)は**必須**。Red-Green-Refactorサイクルに従い、テストを先に書いてから実装する。

- React Testing Library (RTL) によるコンポーネントテスト
- Vitest + Testcontainers によるサービス・Server Actions 統合テスト

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per plan.md (`src/app/`, `src/components/`, `src/views/`, `src/actions/`, `src/services/`, `src/lib/`, `src/hooks/`, `src/types/`)
- [x] T002 Install dependencies: `@react-pdf/renderer`, `resend`, `date-fns`, `swr`
- [x] T003 [P] Configure ESLint/Prettier per Constitution XI
- [x] T004 [P] Create `.env.example` with required environment variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [x] T005 Create Prisma schema in `prisma/schema.prisma` per data-model.md
- [x] T006 Run `pnpm db:generate` and `pnpm db:migrate` to create database tables
- [x] T007 Create seed script in `prisma/seed.ts` for Badge definitions (6 badges)
- [x] T008 Create Prisma client singleton in `src/lib/db.ts`

### Design System (Neobrutalism)

- [x] T009 [P] Configure Tailwind CSS in `tailwind.config.ts` with Neobrutalism theme (colors, shadows, border-width)
- [x] T010 [P] Update `src/styles/globals.css` with Neobrutalism utility classes (`.neo-card`, `.neo-button`)
- [x] T011 [P] Install shadcn/ui components: `button`, `card`, `input`, `toast`, `form`, `label`, `dialog`

### Common Types & Utilities

- [x] T012 [P] Create `src/types/index.ts` with ActionResult, PaginatedResult types
- [x] T013 [P] Create `src/lib/utils.ts` with common utilities (cn helper)

### App Shell

- [x] T014 Create `src/app/layout.tsx` with providers (Toaster)
- [x] T015 [P] Create `src/app/loading.tsx` with Neobrutalism loading UI
- [x] T016 [P] Create `src/app/error.tsx` with error boundary (Constitution X)
- [x] T017 [P] Create `src/app/not-found.tsx`
- [x] T018 Create `src/app/page.tsx` landing page with Neobrutalism design

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - ユーザー登録・ログイン (Priority: P1)

**Goal**: マジックリンクによるパスワードレス認証

**Independent Test**: メールアドレス入力 → マジックリンク送信 → リンククリック → ダッシュボードアクセス

### Tests for User Story 1 (TDD必須)

> **CRITICAL: テストを先に書き、失敗を確認してから実装に移る（Red-Green-Refactor）**

- [ ] T019 [P] [US1] Service test for email validation in `src/services/auth.test.ts`
- [ ] T020 [P] [US1] Server Action test for requestMagicLinkAction in `src/actions/auth.test.ts`
- [x] T021 [P] [US1] Component test for LoginForm in `src/components/auth/LoginForm.test.tsx`
- [ ] T022 [US1] Integration test for magic link flow in `tests/integration/auth.test.ts`

### Implementation for User Story 1

- [x] T023 [US1] Configure Better Auth with Magic Link plugin in `src/lib/auth.ts`
- [x] T024 [US1] Create email service in `src/lib/email.ts` (Resend for prod, console for dev)
- [x] T025 [P] [US1] Create Zod schemas in `src/lib/validations/auth.ts`
- [x] T026 [US1] Implement requestMagicLinkAction in `src/actions/auth.ts`
- [x] T027 [US1] Implement signOutAction in `src/actions/auth.ts`
- [x] T028 [US1] Create Better Auth API route in `src/app/api/auth/[...all]/route.ts`
- [x] T029 [P] [US1] Create LoginForm component in `src/components/auth/LoginForm.tsx`
- [x] T030 [US1] Create login page in `src/app/(auth)/login/page.tsx`
- [x] T031 [US1] Create verify page in `src/app/(auth)/verify/page.tsx`
- [x] T032 [US1] Create auth middleware for protected routes
- [x] T033 [US1] Create dashboard layout in `src/app/(dashboard)/layout.tsx` with auth check

**Checkpoint**: User Story 1 should be fully functional - users can register and login via magic link

---

## Phase 4: User Story 2 - 学習記録の作成・編集 (Priority: P1)

**Goal**: 学習記録のCRUD操作（日付、内容、時間、振り返り）

**Independent Test**: ログイン → 記録作成 → 一覧表示 → 編集 → 削除

### Tests for User Story 2 (TDD必須)

- [ ] T034 [P] [US2] Service test for study-log CRUD in `src/services/study-log.test.ts`
- [ ] T035 [P] [US2] Service test for streak calculation in `src/services/streak.test.ts`
- [ ] T036 [P] [US2] Server Action test for createStudyLogAction in `src/actions/study-log.test.ts`
- [x] T037 [P] [US2] Component test for StudyLogForm in `src/components/study-log/StudyLogForm.test.tsx`
- [ ] T038 [P] [US2] Component test for StudyLogCard in `src/components/study-log/StudyLogCard.test.tsx`
- [ ] T039 [US2] Integration test for study log flow in `tests/integration/study-log.test.ts`

### Implementation for User Story 2

- [x] T040 [P] [US2] Create Zod schemas in `src/lib/validations/study-log.ts`
- [x] T041 [US2] Create study-log service in `src/services/study-log.ts`
- [x] T042 [US2] Create streak service in `src/services/streak.ts` (consecutive days calculation)
- [x] T043 [US2] Implement createStudyLogAction in `src/actions/study-log.ts`
- [x] T044 [US2] Implement updateStudyLogAction in `src/actions/study-log.ts`
- [x] T045 [US2] Implement deleteStudyLogAction in `src/actions/study-log.ts`
- [x] T046 [US2] Implement getStudyLogsAction in `src/actions/study-log.ts`
- [x] T047 [P] [US2] Create StudyLogForm component in `src/components/study-log/StudyLogForm.tsx`
- [x] T048 [P] [US2] Create StudyLogCard component in `src/components/study-log/StudyLogCard.tsx`
- [x] T049 [P] [US2] Create StudyLogList component in `src/components/study-log/StudyLogList.tsx`
- [ ] T050 [US2] Create StudyLogFormView container in `src/views/study-log/StudyLogFormView.tsx`
- [ ] T051 [US2] Create StudyLogListView container in `src/views/study-log/StudyLogListView.tsx`
- [x] T052 [US2] Create study logs list page in `src/app/(dashboard)/logs/page.tsx`
- [x] T053 [US2] Create new study log page in `src/app/(dashboard)/logs/new/page.tsx`
- [x] T054 [US2] Create edit study log page in `src/app/(dashboard)/logs/[id]/edit/page.tsx`

**Checkpoint**: User Story 2 should be fully functional - users can manage study logs with streak updates

---

## Phase 5: User Story 3 - ポモドーロタイマー (Priority: P2)

**Goal**: 25分作業/5分休憩のポモドーロタイマー、完了時に自動記録

**Independent Test**: タイマー開始 → 25分経過（またはスキップ） → 完了通知 → 学習記録に追加

### Tests for User Story 3 (TDD必須)

- [ ] T055 [P] [US3] Hook test for useTimer in `src/hooks/useTimer.test.ts`
- [ ] T056 [P] [US3] Service test for pomodoro completion in `src/services/pomodoro.test.ts`
- [ ] T057 [P] [US3] Server Action test for completePomodoroAction in `src/actions/pomodoro.test.ts`
- [ ] T058 [P] [US3] Component test for PomodoroTimer in `src/components/timer/PomodoroTimer.test.tsx`

### Implementation for User Story 3

- [ ] T059 [US3] Create useTimer hook in `src/hooks/useTimer.ts` (setInterval-based)
- [ ] T060 [US3] Create pomodoro service in `src/services/pomodoro.ts`
- [ ] T061 [US3] Implement completePomodoroAction in `src/actions/pomodoro.ts`
- [ ] T062 [P] [US3] Create PomodoroTimer component in `src/components/timer/PomodoroTimer.tsx`
- [ ] T063 [P] [US3] Create TimerDisplay component in `src/components/timer/TimerDisplay.tsx`
- [ ] T064 [P] [US3] Create TimerControls component in `src/components/timer/TimerControls.tsx`
- [ ] T065 [US3] Create PomodoroTimerView container in `src/views/timer/PomodoroTimerView.tsx`
- [ ] T066 [US3] Create timer page in `src/app/(dashboard)/timer/page.tsx`
- [ ] T067 [US3] Add browser notification permission request

**Checkpoint**: User Story 3 should be fully functional - pomodoro timer works and records to study log

---

## Phase 6: User Story 4 - 学習記録のPDF出力 (Priority: P2)

**Goal**: 期間を指定して学習記録をPDFで出力

**Independent Test**: 期間選択 → PDF生成 → ダウンロード（内容確認）

### Tests for User Story 4 (TDD必須)

- [ ] T068 [P] [US4] Server Action test for generatePdfDataAction in `src/actions/export.test.ts`
- [ ] T069 [P] [US4] Component test for PdfExportForm in `src/components/export/PdfExportForm.test.tsx`
- [ ] T070 [P] [US4] Component test for StudyLogPdf in `src/components/pdf/StudyLogPdf.test.tsx`

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create Zod schemas in `src/lib/validations/export.ts`
- [ ] T072 [US4] Implement generatePdfDataAction in `src/actions/export.ts`
- [ ] T073 [US4] Register Noto Sans JP font for PDF in `src/lib/pdf-fonts.ts`
- [ ] T074 [P] [US4] Create StudyLogPdf component in `src/components/pdf/StudyLogPdf.tsx` (@react-pdf/renderer)
- [ ] T075 [P] [US4] Create PdfExportForm component in `src/components/export/PdfExportForm.tsx`
- [ ] T076 [US4] Create PdfExportView container in `src/views/export/PdfExportView.tsx`
- [ ] T077 [US4] Create export page in `src/app/(dashboard)/export/page.tsx`

**Checkpoint**: User Story 4 should be fully functional - users can export study logs as PDF

---

## Phase 7: User Story 5 - ゲーミフィケーション (Priority: P2)

**Goal**: ストリーク表示、バッジ獲得・表示

**Independent Test**: 学習記録作成 → ストリーク更新確認 → 条件達成時にバッジ獲得

### Tests for User Story 5 (TDD必須)

- [ ] T078 [P] [US5] Service test for badge checking in `src/services/badge.test.ts`
- [ ] T079 [P] [US5] Server Action test for getBadgesAction in `src/actions/badge.test.ts`
- [ ] T080 [P] [US5] Server Action test for getDashboardStatsAction in `src/actions/dashboard.test.ts`
- [ ] T081 [P] [US5] Component test for StreakCard in `src/components/dashboard/StreakCard.test.tsx`
- [ ] T082 [P] [US5] Component test for BadgeCard in `src/components/badge/BadgeCard.test.tsx`

### Implementation for User Story 5

- [ ] T083 [US5] Create badge service in `src/services/badge.ts` with badge definitions
- [ ] T084 [US5] Implement checkAndAwardBadgesAction in `src/actions/badge.ts`
- [ ] T085 [US5] Implement getBadgesAction in `src/actions/badge.ts`
- [ ] T086 [US5] Implement getDashboardStatsAction in `src/actions/dashboard.ts`
- [ ] T087 [US5] Integrate badge checking into createStudyLogAction and completePomodoroAction
- [ ] T088 [P] [US5] Create StreakCard component in `src/components/dashboard/StreakCard.tsx`
- [ ] T089 [P] [US5] Create StatCard component in `src/components/dashboard/StatCard.tsx`
- [ ] T090 [P] [US5] Create RecentBadges component in `src/components/dashboard/RecentBadges.tsx`
- [ ] T091 [P] [US5] Create TodayLogCard component in `src/components/dashboard/TodayLogCard.tsx`
- [ ] T092 [P] [US5] Create BadgeCard component in `src/components/badge/BadgeCard.tsx`
- [ ] T093 [P] [US5] Create BadgeList component in `src/components/badge/BadgeList.tsx`
- [ ] T094 [US5] Create BentoGrid dashboard layout in `src/components/dashboard/BentoGrid.tsx`
- [ ] T095 [US5] Create DashboardView container in `src/views/dashboard/DashboardView.tsx`
- [ ] T096 [US5] Create dashboard page in `src/app/(dashboard)/page.tsx`
- [ ] T097 [US5] Create badges page in `src/app/(dashboard)/badges/page.tsx`

**Checkpoint**: User Story 5 should be fully functional - gamification features work

---

## Phase 8: User Story 6 - 学習記録のX投稿 (Priority: P3)

**Goal**: 学習記録やバッジ獲得をXにシェア

**Independent Test**: シェアボタンクリック → X投稿画面が開く（テキストが事前入力）

### Tests for User Story 6 (TDD必須)

- [ ] T098 [P] [US6] Server Action test for generateShareTextAction in `src/actions/share.test.ts`
- [ ] T099 [P] [US6] Component test for ShareButton in `src/components/share/ShareButton.test.tsx`
- [ ] T100 [P] [US6] Unit test for generateXShareUrl in `src/lib/share.test.ts`

### Implementation for User Story 6

- [ ] T101 [P] [US6] Create share utility in `src/lib/share.ts` (X Web Intent URL generation)
- [ ] T102 [US6] Implement generateShareTextAction in `src/actions/share.ts`
- [ ] T103 [P] [US6] Create ShareButton component in `src/components/share/ShareButton.tsx`
- [ ] T104 [US6] Add ShareButton to StudyLogCard component
- [ ] T105 [US6] Add ShareButton to BadgeCard component
- [ ] T106 [US6] Add ShareButton to TodayLogCard component

**Checkpoint**: User Story 6 should be fully functional - users can share to X

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T107 [P] Add responsive styles for mobile/tablet (Bento Grid breakpoints)
- [ ] T108 [P] Add loading states to all forms and buttons
- [ ] T109 [P] Add toast notifications for all user actions (success/error)
- [ ] T110 Code cleanup and refactoring
- [ ] T111 Run quickstart.md validation (full setup from scratch)
- [ ] T112 Run pr-review-toolkit for final code review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Auth) and US2 (Study Log) are P1 - do first
  - US3-US5 are P2 - do after P1 complete
  - US6 is P3 - do last
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (Auth)**: Foundation only - no dependencies on other stories
- **User Story 2 (Study Log)**: Foundation only - no dependencies on other stories
- **User Story 3 (Pomodoro)**: Requires US2 (creates study logs)
- **User Story 4 (PDF Export)**: Requires US2 (exports study logs)
- **User Story 5 (Gamification)**: Requires US2, integrates with US3
- **User Story 6 (X Share)**: Requires US2 and US5 components

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Services before Server Actions
- Server Actions before components
- Components before views
- Views before pages
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational phase completes, US1 and US2 can start in parallel
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Auth)
4. Complete Phase 4: User Story 2 (Study Log)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready

### Full Feature Delivery

1. Complete MVP (US1 + US2)
2. Add US3 (Pomodoro) + US5 (Gamification) - enhances engagement
3. Add US4 (PDF Export) - data export capability
4. Add US6 (X Share) - social features
5. Phase 9: Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (Red phase)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
