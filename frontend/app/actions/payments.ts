'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { 
            name: true, 
            email: true,
            memberships: {
              where: { status: 'ACTIVE' },
              select: { id: true, pendingDues: true },
              take: 1
            }
          }
        }
      }
    })
    return payments
  } catch (error) {
    console.error('Failed to get payments:', error)
    return []
  }
}

import { revalidatePath } from 'next/cache'

export async function deletePayment(paymentId: string) {
  try {
    await prisma.payment.delete({
      where: { id: paymentId }
    })
    revalidatePath('/admin/payments')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete payment:', error)
    return { success: false, error: 'Failed to delete payment' }
  }
}
