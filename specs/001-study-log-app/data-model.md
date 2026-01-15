# Data Model: 学習管理アプリ

**Date**: 2026-01-15
**Feature**: 001-study-log-app

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│    User     │──────<│    StudyLog     │──────<│  PomodoroSession    │
│             │  1:N  │                 │  1:N  │                     │
└─────────────┘       └─────────────────┘       └─────────────────────┘
      │
      │ N:M (via UserBadge)
      │
┌─────────────────┐
│  UserBadge      │───────>┌─────────────┐
│                 │   N:1  │    Badge    │
└─────────────────┘        └─────────────┘
```

## Entities

### User

Better Authが管理する基本ユーザー情報に加え、学習統計を保持。

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | ユーザーID |
| email | String | Unique, Not Null | メールアドレス |
| emailVerified | Boolean | Default: false | メール検証済みフラグ |
| name | String? | Max 100 | 表示名（任意） |
| image | String? | - | プロフィール画像URL |
| currentStreak | Int | Default: 0, >= 0 | 現在の連続学習日数 |
| maxStreak | Int | Default: 0, >= 0 | 最長連続学習日数 |
| lastStudyDate | DateTime? | - | 最後に学習記録をつけた日 |
| createdAt | DateTime | Default: now() | 登録日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

**Relations**:
- studyLogs: StudyLog[] (1:N)
- userBadges: UserBadge[] (1:N)
- sessions: Session[] (Better Auth管理)
- accounts: Account[] (Better Auth管理)

---

### StudyLog（学習記録）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | 記録ID |
| userId | String | FK -> User.id, Not Null | ユーザーID |
| studyDate | DateTime | Not Null | 学習日（日付部分のみ使用） |
| content | String | Not Null, Max 3000 | 学習内容 |
| durationMinutes | Int | Not Null, >= 0 | 学習時間（分） |
| reflection | String? | Max 1000 | 工夫した点・振り返り |
| createdAt | DateTime | Default: now() | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

**Relations**:
- user: User (N:1)
- pomodoroSessions: PomodoroSession[] (1:N)

**Indexes**:
- (userId, studyDate) - ストリーク計算用
- (userId, createdAt DESC) - 一覧表示用

**Validation Rules**:
- content: 1〜3000文字
- durationMinutes: 0以上（ポモドーロのみの記録も可）
- reflection: 0〜1000文字
- studyDate: 未来日付不可

---

### PomodoroSession

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | セッションID |
| studyLogId | String | FK -> StudyLog.id, Not Null | 学習記録ID |
| completedAt | DateTime | Not Null, Default: now() | 完了日時 |
| durationMinutes | Int | Default: 25 | セッション時間（分） |
| createdAt | DateTime | Default: now() | 作成日時 |

**Relations**:
- studyLog: StudyLog (N:1)

**Business Rules**:
- セッション完了時に自動作成
- 当日のStudyLogがない場合は自動でStudyLogを作成
- durationMinutesは現時点では25固定

---

### Badge（バッジ定義）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK | バッジID（例: 'streak-7'） |
| name | String | Not Null, Unique | バッジ名 |
| description | String | Not Null | 獲得条件の説明 |
| iconUrl | String? | - | アイコンURL（将来用） |
| category | String | Default: 'achievement' | カテゴリ |
| sortOrder | Int | Default: 0 | 表示順 |
| createdAt | DateTime | Default: now() | 作成日時 |

**Relations**:
- userBadges: UserBadge[] (1:N)

**Seed Data**:
| id | name | description |
|----|------|-------------|
| first-log | 初めての学習記録 | 最初の学習記録を作成 |
| streak-3 | 3日連続学習 | 3日連続で学習記録を作成 |
| streak-7 | 7日連続学習 | 7日連続で学習記録を作成 |
| streak-30 | 30日連続学習 | 30日連続で学習記録を作成 |
| pomodoro-master | ポモドーロマスター | 累計100ポモドーロ達成 |
| study-expert | 学習の達人 | 累計100時間学習達成 |

---

### UserBadge（獲得バッジ）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | ID |
| userId | String | FK -> User.id, Not Null | ユーザーID |
| badgeId | String | FK -> Badge.id, Not Null | バッジID |
| earnedAt | DateTime | Not Null, Default: now() | 獲得日時 |

**Relations**:
- user: User (N:1)
- badge: Badge (N:1)

**Constraints**:
- Unique(userId, badgeId) - 同じバッジは1回のみ獲得可能

---

## Better Auth Tables

Better Authが自動生成・管理するテーブル：

### Session
| Field | Type | Description |
|-------|------|-------------|
| id | String | セッションID |
| userId | String | ユーザーID |
| token | String | セッショントークン |
| expiresAt | DateTime | 有効期限 |
| ipAddress | String? | IPアドレス |
| userAgent | String? | User Agent |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### Account
| Field | Type | Description |
|-------|------|-------------|
| id | String | アカウントID |
| userId | String | ユーザーID |
| accountId | String | プロバイダーアカウントID |
| providerId | String | プロバイダーID |
| accessToken | String? | アクセストークン |
| refreshToken | String? | リフレッシュトークン |
| expiresAt | DateTime? | 有効期限 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### Verification
| Field | Type | Description |
|-------|------|-------------|
| id | String | 検証ID |
| identifier | String | メールアドレス等 |
| value | String | トークン値 |
| expiresAt | DateTime | 有効期限（15分） |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Better Auth tables
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?

  // Study app specific
  currentStreak Int       @default(0)
  maxStreak     Int       @default(0)
  lastStudyDate DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  sessions      Session[]
  accounts      Account[]
  studyLogs     StudyLog[]
  userBadges    UserBadge[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Account {
  id           String    @id @default(cuid())
  userId       String
  accountId    String
  providerId   String
  accessToken  String?
  refreshToken String?
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
}

// Application tables
model StudyLog {
  id              String   @id @default(cuid())
  userId          String
  studyDate       DateTime @db.Date
  content         String   @db.VarChar(3000)
  durationMinutes Int      @default(0)
  reflection      String?  @db.VarChar(1000)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  pomodoroSessions PomodoroSession[]

  @@index([userId, studyDate])
  @@index([userId, createdAt(sort: Desc)])
}

model PomodoroSession {
  id              String   @id @default(cuid())
  studyLogId      String
  completedAt     DateTime @default(now())
  durationMinutes Int      @default(25)
  createdAt       DateTime @default(now())

  studyLog StudyLog @relation(fields: [studyLogId], references: [id], onDelete: Cascade)

  @@index([studyLogId])
}

model Badge {
  id          String   @id
  name        String   @unique
  description String
  iconUrl     String?
  category    String   @default("achievement")
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  userBadges UserBadge[]
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@index([userId])
}
```

---

## State Transitions

### StudyLog Lifecycle
```
[Created] → [Updated]* → [Deleted]
```
- 状態は単純なCRUD
- 削除は物理削除（論理削除なし）

### User Streak State
```
streak=0 → streak=1 (初回記録)
streak=N → streak=N+1 (連続日)
streak=N → streak=1 (連続途切れ)
```
- lastStudyDateと現在日付を比較して判定
- 過去日付の記録追加時は再計算

### Badge Acquisition
```
[Not Earned] → [Earned]
```
- 一度獲得したら取り消し不可
- 条件達成時に即時付与
