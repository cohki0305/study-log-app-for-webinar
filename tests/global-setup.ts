import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

let container: StartedPostgreSqlContainer | undefined

const envFilePath = path.resolve(process.cwd(), '.env.test')

export async function setup() {
  container = await new PostgreSqlContainer('postgres:15-alpine').start()
  const databaseUrl = container.getConnectionUri()

  // Worker threads用に.env.testへ書き出し
  fs.writeFileSync(envFilePath, `DATABASE_URL="${databaseUrl}"`)
  process.env.DATABASE_URL = databaseUrl

  // マイグレーション実行（1回のみ）
  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
}

export async function teardown() {
  await container?.stop()
  if (fs.existsSync(envFilePath)) {
    fs.unlinkSync(envFilePath)
  }
}
