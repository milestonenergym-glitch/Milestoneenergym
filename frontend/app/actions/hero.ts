'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getHeroBanners() {
  try {
    return await prisma.heroBanner.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Failed to get hero banners:', error)
    return []
  }
}

export async function createHeroBanner(data: {
  imageUrl: string
  title?: string
  subtitle?: string
  badgeText?: string
  buttonText?: string
  buttonUrl?: string
  order?: number
}) {
  try {
    const maxOrderBanner = await prisma.heroBanner.findFirst({
      orderBy: { order: 'desc' }
    })
    
    const banner = await prisma.heroBanner.create({ 
      data: {
        ...data,
        order: data.order ?? (maxOrderBanner?.order ?? 0) + 1
      }
    })
    revalidatePath('/')
    revalidatePath('/admin/hero')
    return { success: true, banner }
  } catch (error) {
    console.error('Failed to create hero banner:', error)
    return { success: false, error: 'Failed to create banner' }
  }
}

export async function toggleHeroBannerActive(id: string, isActive: boolean) {
  try {
    await prisma.heroBanner.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/')
    revalidatePath('/admin/hero')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update banner' }
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    await prisma.heroBanner.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/hero')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete banner' }
  }
}
