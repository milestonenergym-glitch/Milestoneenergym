const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Super Admin
  const adminEmail = 'admin@milestoneenergym.com'
  const password = await bcrypt.hash('Admin@123', 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin',
      passwordHash: password,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('Super Admin created:', admin.email)

  // 2. Create default Gym Settings
  const existingSettings = await prisma.gymSettings.findFirst()
  if (!existingSettings) {
    const settings = await prisma.gymSettings.create({
      data: {
        gymName: 'Milestone Energym',
        logoUrl: '/logo.jpg',
        contactPhone: '+91 8875305442',
        contactEmail: 'Milestonenergym@gmail.com',
        address: 'नवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर, Barmer, Rajasthan-344001',
      },
    })
    console.log('Default GymSettings created')
  } else {
    console.log('GymSettings already exist')
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
