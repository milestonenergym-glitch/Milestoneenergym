'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get testimonials:', error)
    return []
  }
}

export async function createTestimonial(data: {
  name: string
  role?: string
  content: string
  rating?: number
  imageUrl?: string
}) {
  try {
    const testimonial = await prisma.testimonial.create({ 
      data: {
        ...data,
        rating: data.rating ?? 5
      } 
    })
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true, testimonial }
  } catch (error) {
    console.error('Failed to create testimonial:', error)
    return { success: false, error: 'Failed to create testimonial' }
  }
}

export async function toggleTestimonialActive(id: string, isActive: boolean) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update testimonial' }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete testimonial' }
  }
}
