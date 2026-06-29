'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getDashboardStats() {
  try {
    // 1. Total Active Members (Users with ACTIVE Membership)
    const activeMembersCount = await prisma.membership.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // 2. New Leads This Month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const newLeadsCount = await prisma.lead.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // 3. Monthly Revenue
    const paymentsThisMonth = await prisma.payment.findMany({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: startOfMonth
        }
      },
      select: { amount: true }
    })
    const monthlyRevenue = paymentsThisMonth.reduce((acc, curr) => acc + curr.amount, 0)

    // 4. Expiring Memberships (Next 7 days)
    const next7Days = new Date()
    next7Days.setDate(next7Days.getDate() + 7)
    
    const expiringMembershipsCount = await prisma.membership.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: next7Days,
          gte: new Date()
        }
      }
    })

    return {
      activeMembersCount,
      newLeadsCount,
      monthlyRevenue,
      expiringMembershipsCount
    }
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    return {
      activeMembersCount: 0,
      newLeadsCount: 0,
      monthlyRevenue: 0,
      expiringMembershipsCount: 0
    }
  }
}

export async function getExpiringMembers() {
  try {
    const next7Days = new Date()
    next7Days.setDate(next7Days.getDate() + 7)

    const past30Days = new Date()
    past30Days.setDate(past30Days.getDate() - 30)

    const memberships = await prisma.membership.findMany({
      where: {
        endDate: {
          lte: next7Days,
          gte: past30Days
        }
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        plan: true
      },
      orderBy: {
        endDate: 'asc'
      }
    })

    // To prevent duplicate users if they have multiple memberships, we only want the most recent active membership for each user
    // However, we should actually fetch ALL memberships for these users to determine if they ALREADY renewed.
    // So let's get the user IDs from the initial query.
    const userIds = memberships.map(m => m.userId)

    const allUserMemberships = await prisma.membership.findMany({
      where: { userId: { in: userIds } },
      include: {
        user: { include: { profile: true } },
        plan: true
      },
      orderBy: { endDate: 'desc' }
    })

    const userLatestMembershipMap = new Map()
    for (const m of allUserMemberships) {
      if (!userLatestMembershipMap.has(m.userId)) {
        userLatestMembershipMap.set(m.userId, m)
      }
    }

    const latestMemberships = Array.from(userLatestMembershipMap.values())
    
    // Filter to only include those whose LATEST membership is actually expiring/expired in this window
    return latestMemberships.filter((m: any) => {
       const end = new Date(m.endDate)
       return end >= past30Days && end <= next7Days
    })

  } catch (error) {
    console.error('Failed to get expiring members:', error)
    return []
  }
}
