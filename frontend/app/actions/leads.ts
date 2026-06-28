'use server'

import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Mobile number must be at least 10 digits'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  source: z.string().default('WEBSITE_CONTACT'),
})

export async function submitLead(formData: FormData) {
  try {
    const rawData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      source: 'WEBSITE_CONTACT',
    }

    const validatedData = leadSchema.parse(rawData)

    await prisma.lead.create({
      data: {
        ...validatedData,
        email: validatedData.email || 'No email provided',
      },
    })

    revalidatePath('/admin/leads')
    return { success: true, message: 'Your message has been sent successfully.' }
  } catch (error) {
    console.error('Lead submission error:', error)
    return { success: false, error: 'Failed to submit message. Please try again.' }
  }
}

export async function submitPopupLead(data: { 
  name: string; 
  phone: string; 
  email?: string;
  age: string;
  gender: string;
  goal: string;
  time: string;
  message?: string;
}) {
  try {
    // Basic validation
    if (!data.name || !data.phone) {
      return { success: false, error: 'Name and Phone are required' }
    }

    const formattedMessage = `
Age: ${data.age}
Gender: ${data.gender}
Goal: ${data.goal}
Preferred Time: ${data.time}
Message: ${data.message || 'No additional message'}
    `.trim()

    await prisma.lead.create({
      data: {
        firstName: data.name,
        lastName: '-', // Dummy as it's a single name field
        phone: data.phone,
        email: data.email || 'No email provided',
        pincode: 'Not Provided', // Not collecting this anymore
        source: 'POPUP',
        subject: 'New Free Trial Request',
        message: formattedMessage,
      },
    })

    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error) {
    console.error('Popup lead error:', error)
    return { success: false, error: 'Failed to submit' }
  }
}

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: true }
    })
    return leads
  } catch (error) {
    console.error('Error fetching leads:', error)
    return []
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead:', error)
    return { success: false }
  }
}
