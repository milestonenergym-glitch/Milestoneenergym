'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function markAttendance(userId: string, dateStr?: string) {
  try {
    const targetDate = dateStr ? new Date(dateStr) : new Date()
    
    // Set to start of the target day
    const dayStart = new Date(targetDate)
    dayStart.setHours(0, 0, 0, 0)
    
    // Set to end of the target day
    const dayEnd = new Date(targetDate)
    dayEnd.setHours(23, 59, 59, 999)

    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: { gte: dayStart, lte: dayEnd }
      }
    })

    if (existing) {
      return { success: false, error: `Member already checked in on this date.` }
    }

    // When marking past attendance, we'll use a time around noon on that date to be safe
    let insertDate = new Date()
    if (dateStr) {
      insertDate = new Date(dateStr)
      insertDate.setHours(12, 0, 0, 0)
    }

    await prisma.attendance.create({
      data: { 
        userId,
        date: insertDate
      }
    })

    revalidatePath('/admin/attendance')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark attendance:', error)
    return { success: false, error: 'Failed to mark attendance' }
  }
}

export async function getAttendanceByDate(dateStr?: string) {
  try {
    const targetDate = dateStr ? new Date(dateStr) : new Date()
    
    const dayStart = new Date(targetDate)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(targetDate)
    dayEnd.setHours(23, 59, 59, 999)

    const records = await prisma.attendance.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd }
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

// Kept for backward compatibility if used anywhere else
export async function getTodayAttendance() {
  return getAttendanceByDate()
}
