'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getGymSettings() {
  try {
    let settings = await prisma.gymSettings.findFirst()
    if (!settings) {
      settings = await prisma.gymSettings.create({
        data: {
          gymName: "Milestone Energym",
          contactPhone: "+91 8875305442",
          contactEmail: "Milestonenergym@gmail.com",
          address: "नवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर, Barmer, Rajasthan-344001",
          facebookUrl: "https://www.facebook.com/share/17wKrcgpUk/",
          instagramUrl: "https://www.instagram.com/milestonenergym?igsh=MWU0cXI3dzdqOGVvdQ==",
          youtubeUrl: "https://youtube.com/@milestoneenergym?si=UBXz4UYjg9I8T-X7",
          businessHours: "[{\"day\":\"Monday - Saturday\",\"time\":\"5:30 AM - 10:30 PM\"},{\"day\":\"Sunday\",\"time\":\"Closed\"}]"
        }
      })
    }
    return settings
  } catch (error) {
    console.error('Failed to fetch gym settings:', error)
    return null
  }
}

export async function updateGymSettings(data: any) {
  try {
    const settings = await prisma.gymSettings.findFirst()
    if (!settings) return { success: false }

    const updated = await prisma.gymSettings.update({
      where: { id: settings.id },
      data
    })
    return { success: true, settings: updated }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return { success: false }
  }
}
