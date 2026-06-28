'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getClasses() {
  try {
    const classes = await prisma.gymClass.findMany({
      include: {
        trainer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return classes
  } catch (error) {
    console.error('Failed to get classes:', error)
    return []
  }
}

export async function createClass(data: {
  name: string
  description?: string
  capacity: number
  scheduleTime?: string
  day?: string
  time?: string
  duration?: string
  classType?: string
  trainerId?: string
}) {
  try {
    const gymClass = await prisma.gymClass.create({ data })
    revalidatePath('/admin/classes')
    revalidatePath('/')
    revalidatePath('/classes')
    return { success: true, gymClass }
  } catch (error) {
    console.error('Failed to create class:', error)
    return { success: false, error: 'Failed to create class' }
  }
}

export async function deleteClass(id: string) {
  try {
    await prisma.gymClass.delete({ where: { id } })
    revalidatePath('/admin/classes')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete class' }
  }
}

export async function getTrainers() {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: 'TRAINER' },
      select: { id: true, name: true }
    })
    return trainers
  } catch (error) {
    return []
  }
}
