import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Milestone Energym',
  description: 'Get in touch with Milestone Energym in Barmer. Contact us for gym memberships, personal training inquiries, or book a free trial today.',
  alternates: {
    canonical: 'https://milestoneenergym.com/contact',
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
