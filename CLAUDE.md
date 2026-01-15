# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm format           # Prettier format
pnpm typecheck        # TypeScript check

# Testing
pnpm test             # Run all tests (uses Testcontainers for PostgreSQL)
pnpm test src/        # Run component tests only
pnpm test tests/      # Run integration tests only
pnpm test path/to/file.test.ts  # Run single test file

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to database
docker compose up -d  # Start PostgreSQL (port 5437)

# Auto-generation (手書きせず必ずコマンドを使用)
pnpm dlx shadcn@latest add [component]  # shadcn/ui component
pnpm dlx @better-auth/cli generate      # Better Auth
pnpm prisma migrate dev --name [name]   # Prisma migration
```

## Tech Stack

| Category         | Tech                        | Purpose                     |
| ---------------- | --------------------------- | --------------------------- |
| Package Manager  | pnpm                        | Package management          |
| Framework        | Next.js (App Router)        | Full-stack React framework  |
| Styling          | Tailwind CSS + shadcn/ui    | UI components               |
| Validation       | Zod                         | Schema validation           |
| Form             | useActionState              | Form state management       |
| Data Fetching    | SWR                         | Data fetch & cache          |
| State            | Jotai (optional)            | Global UI state when needed |
| ORM              | Prisma                      | Database access             |
| Auth             | Better Auth                 | Authentication              |
| Testing          | Vitest + RTL + Testcontainers | Unit/Integration tests    |

## Architecture

### Layer Structure

```
Actions → Services → Prisma
   ↓
 Views → Components
```

- **Actions** (`src/actions/`): Server Actions with Zod validation. Entry point for client.
- **Services** (`src/services/`): Business logic with dependency injection (receives PrismaClient).
- **Views** (`src/views/`): Container components - data fetching, state, Server Action calls.
- **Components** (`src/components/`): Presentational components - props only, no side effects.

### Directory Structure

```
src/
├── app/                    # App Router
│   ├── (auth)/            # Auth pages (Route Group)
│   ├── (dashboard)/       # Dashboard (Route Group)
│   └── api/               # API Routes (Webhook等のみ)
├── components/            # Presentational Components
│   └── ui/               # shadcn/ui
├── views/                 # Container Components
├── actions/               # Server Actions
├── services/              # Business logic (DI pattern)
├── lib/                   # Utilities
├── stores/                # Jotai atoms (必要時のみ)
├── hooks/                 # Custom hooks
└── types/                 # Type definitions
tests/
└── integration/           # Integration tests (Testcontainers)
```

### Test Structure

- **Unit/Component tests**: Co-located with source (`src/**/*.test.{ts,tsx}`)
- **Integration tests**: `tests/integration/` - uses Testcontainers PostgreSQL

Vitest projects:
- `components`: jsdom environment for React components
- `integration`: node environment for database tests

### Database

Prisma with PostgreSQL adapter (`@prisma/adapter-pg`). Generated client outputs to `src/generated/prisma/`.

## Key Patterns

### TDD Required (非交渉事項)

**Red-Green-Refactor**: テストを先に書く → 失敗を確認 → 実装 → リファクタリング

```typescript
// 1. RED: Write failing test first
it('should create user with valid data', async () => {
  const user = await userService.create({ email: 'test@example.com', name: 'Test' })
  expect(user.email).toBe('test@example.com')
})

// 2. GREEN: Implement to pass
// 3. REFACTOR: Clean up
```

### Server Actions

**Zodバリデーションは必ずServer Actionで行う**（サービス層ではなく）。

```typescript
// src/actions/*.ts
'use server'

const createUserSchema = z.object({
  email: z.string().min(1).email(),
  name: z.string().max(100),
})

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  // 1. Zod validation (Server Actionの責務)
  const result = schema.safeParse(rawData)
  if (!result.success) return { success: false, fieldErrors: ... }

  // 2. Call service (バリデーション済みデータを渡す)
  await userService.create(result.data)

  // 3. Return { success: true } or { success: false, error }
}
```

### Services (DI Pattern)

```typescript
// src/services/*.ts
export function createUserService(prisma: PrismaClient) {
  return {
    async create(input: CreateUserInput): Promise<User> { ... }
  }
}
```

### Form with useActionState

```typescript
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

### Data Fetching with SWR

```typescript
import useSWR from 'swr'

function UserPageView() {
  const { data: users, mutate } = useSWR('users', getUsers)

  const handleCreate = async (formData: FormData) => {
    const result = await createUserAction(prevState, formData)
    if (result.success) mutate() // Revalidate cache
    return result
  }
}
```

## Naming Conventions

| Target          | Rule                      | Example                    |
| --------------- | ------------------------- | -------------------------- |
| Component       | PascalCase                | `UserProfile.tsx`          |
| Hook            | camelCase + use prefix    | `useAuth.ts`               |
| Constant        | SCREAMING_SNAKE_CASE      | `MAX_RETRY_COUNT`          |
| Zod Schema      | camelCase + Schema suffix | `userSchema`               |
| Server Action   | camelCase + Action suffix | `createUserAction`         |
| Jotai Atom      | camelCase + Atom suffix   | `themeAtom`                |

## Constitution

See `.specify/memory/constitution.md` for full coding standards:
- TDD required (Red-Green-Refactor)
- Presentational/Container component separation
- Server Components by default, `'use client'` only when needed
- Zod validation in Server Actions (not in services)
- Design system (4px grid, Major Third scale typography)
- Post-implementation review with pr-review-toolkit agents
