# Vibe Template

Next.js (App Router) ベースのフルスタック Web アプリケーションテンプレート。

## Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: PostgreSQL (Prisma ORM)
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL

## Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd vibe-template
pnpm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL

# 3. Generate Prisma client
pnpm db:generate

# 4. Start development server
pnpm dev
```

Open http://localhost:3000

## Commands

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Production build         |
| `pnpm start`         | Start production server  |
| `pnpm lint`          | Run ESLint               |
| `pnpm lint:fix`      | Fix ESLint issues        |
| `pnpm format`        | Format with Prettier     |
| `pnpm format:check`  | Check formatting         |
| `pnpm typecheck`     | TypeScript type check    |
| `pnpm test`          | Run tests                |
| `pnpm test:ui`       | Open Vitest UI           |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm db:generate`   | Generate Prisma client   |
| `pnpm db:migrate`    | Run database migrations  |
| `pnpm db:push`       | Push schema to database  |
| `pnpm db:studio`     | Open Prisma Studio       |

## Project Structure

```
src/
├── app/           # Pages & layouts (App Router)
├── components/    # Presentational Components
│   └── ui/        # shadcn/ui components
├── views/         # Container Components
├── actions/       # Server Actions
├── lib/           # Utilities & config
├── hooks/         # Custom hooks
├── types/         # Type definitions
└── generated/     # Generated code (Prisma)
```

## Development Guidelines

See `.specify/memory/constitution.md` for coding standards and best practices.
