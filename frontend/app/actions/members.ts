'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getMembers() {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: {
        profile: true,
        memberships: {
          include: { plan: true },
          orderBy: { endDate: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return members
  } catch (error) {
    console.error('Failed to fetch members:', error)
    return []
  }
}

export async function createMember(data: any) {
  try {
    const { name, email, phone, planId, durationInDays, amountPaid, ...profileData } = data

    // Create User, Profile, and initial Membership in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          role: 'MEMBER',
          profile: {
            create: {
              phone,
              ...profileData
            }
          }
        }
      })

      if (planId) {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + Number(durationInDays))

        await tx.membership.create({
          data: {
            userId: newUser.id,
            planId,
            startDate,
            endDate,
            amountPaid: Number(amountPaid),
            status: 'ACTIVE'
          }
        })

        // Log the payment
        if (Number(amountPaid) > 0) {
          await tx.payment.create({
            data: {
              userId: newUser.id,
              amount: Number(amountPaid),
              status: 'SUCCESS',
              description: 'Initial Membership Payment'
            }
          })
        }
      }

      return newUser
    })

    revalidatePath('/admin/members')
    return { success: true, user }
  } catch (error) {
    console.error('Failed to create member:', error)
    return { success: false, error: 'Failed to create member' }
  }
}
