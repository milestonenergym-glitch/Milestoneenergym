const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const lead = await prisma.lead.create({
      data: {
        firstName: 'Test',
        lastName: '-',
        phone: '1234567890',
        email: 'test@example.com',
        pincode: '123456',
        source: 'POPUP',
        subject: 'New Popup Lead',
      }
    });
    console.log('Successfully created lead:', lead);
  } catch (error) {
    console.error('Failed to create lead:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
