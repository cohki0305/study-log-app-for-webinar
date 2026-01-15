import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const badges = [
  {
    id: 'first-log',
    name: '初めての学習記録',
    description: '最初の学習記録を作成',
    category: 'achievement',
    sortOrder: 1,
  },
  {
    id: 'streak-3',
    name: '3日連続学習',
    description: '3日連続で学習記録を作成',
    category: 'streak',
    sortOrder: 2,
  },
  {
    id: 'streak-7',
    name: '7日連続学習',
    description: '7日連続で学習記録を作成',
    category: 'streak',
    sortOrder: 3,
  },
  {
    id: 'streak-30',
    name: '30日連続学習',
    description: '30日連続で学習記録を作成',
    category: 'streak',
    sortOrder: 4,
  },
  {
    id: 'pomodoro-master',
    name: 'ポモドーロマスター',
    description: '累計100ポモドーロ達成',
    category: 'achievement',
    sortOrder: 5,
  },
  {
    id: 'study-expert',
    name: '学習の達人',
    description: '累計100時間学習達成',
    category: 'achievement',
    sortOrder: 6,
  },
]

async function main() {
  console.log('Seeding badges...')

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    })
  }

  console.log(`Seeded ${badges.length} badges`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
