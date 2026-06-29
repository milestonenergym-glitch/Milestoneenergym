'use server'

import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function generateRegistrationLink() {
  try {
    const uniquePart = randomBytes(8).toString('hex')
    const token = `Milestoneenergym_fill_membership_plan_${uniquePart}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 mins

    await prisma.registrationLink.create({
      data: {
        token,
        expiresAt,
      },
    })

    return { success: true, token }
  } catch (error) {
    console.error('Error generating link:', error)
    return { success: false, error: 'Failed to generate link' }
  }
}

export async function getRegistrationLink(token: string) {
  try {
    const link = await prisma.registrationLink.findUnique({
      where: { token }
    })
    return link
  } catch (error) {
    console.error('Error fetching link:', error)
    return null
  }
}

export async function markLinkAsUsed(token: string) {
  try {
    await prisma.registrationLink.update({
      where: { token },
      data: { isUsed: true }
    })
    return { success: true }
  } catch (error) {
    console.error('Error marking link as used:', error)
    return { success: false }
  }
}
