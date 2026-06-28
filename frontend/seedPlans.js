const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const plans = [
    { name: 'Monthly', price: 1500, durationInDays: 30, description: 'Perfect for beginners' },
    { name: 'Quarterly', price: 3999, durationInDays: 90, description: 'Save more with 3 months' },
    { name: 'Half Yearly', price: 6999, durationInDays: 180, description: 'Most popular choice' },
    { name: 'Yearly', price: 11999, durationInDays: 365, description: 'Best value for money' },
  ]

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan
    })
    console.log(`Created plan: ${plan.name}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
