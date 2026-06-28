'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })
    return payments
  } catch (error) {
    console.error('Failed to get payments:', error)
    return []
  }
}
