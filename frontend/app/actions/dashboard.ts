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
