const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.deleteMany({
    where: {
      role: 'MEMBER'
    }
  })
  console.log(`Deleted ${result.count} members!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
