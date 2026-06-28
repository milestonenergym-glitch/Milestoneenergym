'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get gallery images:', error)
    return []
  }
}

export async function createGalleryImage(data: {
  imageUrl: string
  category: string
  title?: string
}) {
  try {
    const image = await prisma.galleryImage.create({ 
      data: {
        ...data,
        isActive: true
      } 
    })
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')
    return { success: true, image }
  } catch (error) {
    console.error('Failed to create gallery image:', error)
    return { success: false, error: 'Failed to upload image' }
  }
}

export async function toggleGalleryImageActive(id: string, isActive: boolean) {
  try {
    await prisma.galleryImage.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update image status' }
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await prisma.galleryImage.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/admin/gallery')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image' }
  }
}
