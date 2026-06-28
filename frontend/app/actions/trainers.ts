'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getTrainerProfiles() {
  try {
    return await prisma.trainerProfile.findMany({
      include: {
        user: {
          select: { name: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get trainers:', error)
    return []
  }
}

export async function createTrainerProfile(data: {
  userId: string
  specialization?: string
  experienceYears: number
  bio?: string
}) {
  try {
    // Check if user is a trainer
    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    if (!user) return { success: false, error: 'User not found' }
    if (user.role !== 'TRAINER') {
      await prisma.user.update({
        where: { id: data.userId },
        data: { role: 'TRAINER' }
      })
    }

    const trainer = await prisma.trainerProfile.create({ data })
    revalidatePath('/')
    revalidatePath('/admin/trainers')
    return { success: true, trainer }
  } catch (error) {
    console.error('Failed to create trainer:', error)
    return { success: false, error: 'Failed to create trainer' }
  }
}

export async function deleteTrainerProfile(id: string) {
  try {
    await prisma.trainerProfile.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/trainers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete trainer' }
  }
}
