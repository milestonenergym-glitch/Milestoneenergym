'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getDashboardStats() {
  try {
    const now = new Date()
    
    // 1. Total Active Members
    const activeMembersCount = await prisma.membership.count({
      where: {
        status: 'ACTIVE',
        endDate: { gte: now }
      }
    })

    // 2. New Leads (This Week)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(now.getDate() - 7)
    const newLeadsCount = await prisma.lead.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    })

    // 3. Monthly Revenue
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const paymentsThisMonth = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'SUCCESS',
        createdAt: { gte: startOfMonth }
      }
    })
    const monthlyRevenue = paymentsThisMonth._sum.amount || 0

    // 4. Expiring Memberships (Next 7 Days)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(now.getDate() + 7)
    const expiringMembershipsCount = await prisma.membership.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: now,
          lte: sevenDaysFromNow
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
