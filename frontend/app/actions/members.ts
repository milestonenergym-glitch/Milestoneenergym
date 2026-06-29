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

export async function getMemberById(id: string) {
  try {
    const member = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        memberships: {
          include: { plan: true },
          orderBy: { endDate: 'desc' },
          take: 1
        }
      }
    })
    return member
  } catch (error) {
    console.error('Failed to fetch member by ID:', error)
    return null
  }
}

export async function getMemberSequentialId(createdAt: Date) {
  try {
    const count = await prisma.user.count({
      where: {
        role: 'MEMBER',
        createdAt: {
          lte: createdAt
        }
      }
    })
    return `MILESTONEENERGYM${String(count).padStart(3, '0')}`
  } catch (error) {
    return `MILESTONEENERGYM001`
  }
}

export async function createMember(data: any) {
  try {
    const { name, email, phone, planId, durationMonths, durationInDays, totalAmount, amountPaid, pendingDues, pdfAmount, paymentMode, startDate, ...profileData } = data

    // Create User, Profile, and initial Membership in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: email || undefined,
          role: 'MEMBER',
          profile: {
            create: {
              phone,
              ...profileData
            }
          }
        }
      })

      let finalPlanId = planId;
      let finalDurationInDays = Number(durationInDays);

      if (durationMonths && !finalPlanId) {
        const planName = `${durationMonths} Month${durationMonths > 1 ? 's' : ''}`
        let plan = await tx.plan.findFirst({
          where: { name: planName }
        })

        if (!plan) {
          plan = await tx.plan.create({
            data: {
              name: planName,
              durationInDays: Number(durationMonths) * 30,
              price: 0,
              isActive: false
            }
          })
        }
        finalPlanId = plan.id;
        finalDurationInDays = plan.durationInDays;
      }

      if (finalPlanId) {
        const startDate = data.startDate ? new Date(data.startDate) : new Date()
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + finalDurationInDays)

        await tx.membership.create({
          data: {
            userId: newUser.id,
            planId: finalPlanId,
            startDate,
            endDate,
            totalAmount: totalAmount ? Number(totalAmount) : null,
            amountPaid: Number(amountPaid),
            pendingDues: pendingDues ? Number(pendingDues) : 0,
            pdfAmount: pdfAmount ? Number(pdfAmount) : null,
            paymentMode: paymentMode || 'CASH',
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
              paymentMode: paymentMode || 'CASH',
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

export async function updateMemberProfile(userId: string, data: any) {
  try {
    const { name, email, phone, ...profileData } = data

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        profile: {
          upsert: {
            create: { phone, ...profileData },
            update: { phone, ...profileData }
          }
        }
      }
    })

    revalidatePath('/admin/members')
    return { success: true }
  } catch (error) {
    console.error('Failed to update member profile:', error)
    return { success: false, error: 'Failed to update member profile' }
  }
}

export async function renewMember(userId: string, data: any) {
  try {
    const { planId, durationMonths, durationInDays, startDate, endDate, totalAmount, amountPaid, pendingDues, pdfAmount, paymentMode } = data

    // handle custom plan logic
    let finalPlanId = planId
    let finalDurationInDays = Number(durationInDays)

    const membership = await prisma.$transaction(async (tx) => {
      if (durationMonths && !finalPlanId) {
        const planName = `${durationMonths} Month${durationMonths > 1 ? 's' : ''}`
        let plan = await tx.plan.findFirst({
          where: { name: planName }
        })

        if (!plan) {
          plan = await tx.plan.create({
            data: {
              name: planName,
              durationInDays: Number(durationMonths) * 30,
              price: 0,
              isActive: false
            }
          })
        }
        finalPlanId = plan.id;
        finalDurationInDays = plan.durationInDays;
      }

      // Mark existing memberships as EXPIRED so the new one takes precedence
      await tx.membership.updateMany({
        where: { userId },
        data: { status: 'EXPIRED' }
      })

      const newMembership = await tx.membership.create({
        data: {
          userId,
          planId: finalPlanId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalAmount: totalAmount ? Number(totalAmount) : null,
          amountPaid: Number(amountPaid),
          pendingDues: pendingDues ? Number(pendingDues) : 0,
          pdfAmount: pdfAmount ? Number(pdfAmount) : null,
          paymentMode: paymentMode || 'CASH',
          status: 'ACTIVE'
        }
      })

      // 2. Clear the requested duration since they now have a plan
      await tx.memberProfile.update({
        where: { userId },
        data: { requestedDuration: null }
      })

      // 3. Log the payment
      if (Number(amountPaid) > 0) {
        await tx.payment.create({
          data: {
            userId,
            amount: Number(amountPaid),
            paymentMode,
            status: 'SUCCESS',
            description: 'Membership Renewal Payment'
          }
        })
      }
      return newMembership
    })

    revalidatePath('/admin/members')
    return { success: true, membership }
  } catch (error) {
    console.error('Failed to renew member:', error)
    return { success: false, error: 'Failed to renew member' }
  }
}

export async function assignMembershipToMember(userId: string, data: any) {
  try {
    const { durationMonths, startDate, endDate, amountPaid, pdfAmount, paymentMode } = data

    await prisma.$transaction(async (tx) => {
      // Find or create a plan for this duration
      const durationMonthsNum = Number(durationMonths)
      const planName = `${durationMonthsNum} Month${durationMonthsNum > 1 ? 's' : ''}`
      let plan = await tx.plan.findFirst({
        where: { name: planName }
      })

      if (!plan) {
        plan = await tx.plan.create({
          data: {
            name: planName,
            durationInDays: durationMonthsNum * 30,
            price: 0,
            isActive: false // Hidden from standard plans
          }
        })
      }

      // Mark existing memberships as EXPIRED so the new one takes precedence
      await tx.membership.updateMany({
        where: { userId },
        data: { status: 'EXPIRED' }
      })

      // 1. Create the membership
      await tx.membership.create({
        data: {
          userId,
          planId: plan.id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          amountPaid: Number(amountPaid),
          pdfAmount: pdfAmount ? Number(pdfAmount) : null,
          paymentMode,
          status: 'ACTIVE'
        }
      })

      // 2. Clear the requested duration since they now have a plan
      await tx.memberProfile.update({
        where: { userId },
        data: { requestedDuration: null }
      })

      // 3. Log the payment
      if (Number(amountPaid) > 0 && data.logPayment !== false) {
        await tx.payment.create({
          data: {
            userId,
            amount: Number(amountPaid),
            paymentMode,
            status: 'SUCCESS',
            description: 'Membership Plan Payment'
          }
        })
      }
    })

    revalidatePath('/admin/members')
    return { success: true }
  } catch (error) {
    console.error('Failed to assign membership:', error)
    return { success: false, error: 'Failed to assign membership' }
  }
}

export async function settleDues(membershipId: string, amountToPay: number, paymentMode: string = 'CASH') {
  try {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId }
    })

    if (!membership) throw new Error("Membership not found")

    const newAmountPaid = membership.amountPaid + amountToPay
    const newPendingDues = Math.max(0, membership.pendingDues - amountToPay)

    await prisma.$transaction(async (tx) => {
      // 1. Update Membership
      await tx.membership.update({
        where: { id: membershipId },
        data: {
          amountPaid: newAmountPaid,
          pendingDues: newPendingDues
        }
      })

      // 2. Record Payment
      await tx.payment.create({
        data: {
          userId: membership.userId,
          amount: amountToPay,
          status: 'SUCCESS',
          paymentMode,
          description: 'Pending Dues Settlement'
        }
      })
    })

    revalidatePath('/admin/members')
    return { success: true }
  } catch (error) {
    console.error('Failed to settle dues:', error)
    return { success: false, error: 'Failed to settle dues' }
  }
}
