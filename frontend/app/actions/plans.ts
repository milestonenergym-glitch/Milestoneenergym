'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany({
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
    await prisma.plan.delete({ where: { id } })
    revalidatePath('/admin/plans')
    revalidatePath('/')
    revalidatePath('/membership')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Cannot delete plan in use' }
  }
}
