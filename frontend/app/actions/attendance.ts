'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function markAttendance(userId: string) {
  try {
    // Basic check: prevent double check-in today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: { gte: todayStart, lte: todayEnd }
      }
    })

    if (existing) {
      return { success: false, error: 'Member already checked in today.' }
    }

    await prisma.attendance.create({
      data: { userId }
    })

    revalidatePath('/admin/attendance')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark attendance:', error)
    return { success: false, error: 'Failed to mark attendance' }
  }
}

export async function getTodayAttendance() {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const records = await prisma.attendance.findMany({
      where: {
        date: { gte: todayStart }
      },
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { date: 'desc' }
    })
    
    return records
  } catch (error) {
    console.error('Failed to fetch attendance:', error)
    return []
  }
}
