const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@milestoneenergym.com';
  const password = 'adminpassword123';
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created!');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
