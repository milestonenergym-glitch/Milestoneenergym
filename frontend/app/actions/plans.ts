'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })
    return plans
  } catch (error) {
    console.error('Failed to get plans:', error)
    return []
  }
}

export async function createPlan(data: {
  name: string
  description?: string
  price: number
  originalPrice?: number
  durationInDays: number
  features?: string
  popular?: boolean
  colorTheme?: string
}) {
  try {
    const plan = await prisma.plan.create({ data })
    revalidatePath('/admin/plans')
    revalidatePath('/admin/members')
    return { success: true, plan }
  } catch (error) {
    console.error('Failed to create plan:', error)
    return { success: false, error: 'Failed to create plan' }
  }
}

export async function updatePlan(id: string, data: {
  name: string
  description?: string
  price: number
  originalPrice?: number
  durationInDays: number
  features?: string
  popular?: boolean
  colorTheme?: string
}) {
  try {
    const plan = await prisma.plan.update({ where: { id }, data })
    revalidatePath('/admin/plans')
    revalidatePath('/admin/members')
    revalidatePath('/')
    revalidatePath('/membership')
    return { success: true, plan }
  } catch (error) {
    console.error('Failed to update plan:', error)
    return { success: false, error: 'Failed to update plan' }
  }
}

export async function deletePlan(id: string) {
  try {
    try {
      // Attempt hard delete first
      await prisma.plan.delete({ where: { id } })
    } catch (hardDeleteError) {
      // If it fails (likely due to Foreign Key constraint), soft delete it
      await prisma.plan.update({ where: { id }, data: { isActive: false } })
    }
    revalidatePath('/admin/plans')
    revalidatePath('/admin/members')
    revalidatePath('/')
    revalidatePath('/membership')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete plan' }
  }
}
