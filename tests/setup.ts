import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { beforeAll, afterAll, afterEach } from 'vitest'
import dotenv from 'dotenv'
import path from 'path'

// .env.testから環境変数を読み込み
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

// オブジェクトとしてエクスポートして参照を維持
export const testDb: { prisma: PrismaClient | null; pool: Pool | null } = {
  prisma: null,
  pool: null,
}

async function clearDatabase() {
  if (!testDb.prisma) return

  const tablenames = await testDb.prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tablenames
    .filter(({ tablename }) => tablename !== '_prisma_migrations')
    .map(({ tablename }) => `"public"."${tablename}"`)
    .join(', ')

  if (tables.length > 0) {
    await testDb.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`)
  }
}

beforeAll(async () => {
  testDb.pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(testDb.pool)
  testDb.prisma = new PrismaClient({ adapter })
})

afterEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await testDb.prisma?.$disconnect()
  await testDb.pool?.end()
})

// 便利なgetter
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!testDb.prisma) {
      throw new Error(
        'Prisma client not initialized. Make sure tests are running in the correct environment.'
      )
    }
    return (testDb.prisma as unknown as Record<string | symbol, unknown>)[prop]
  },
})
