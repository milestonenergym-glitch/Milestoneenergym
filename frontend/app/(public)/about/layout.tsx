import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Milestone Energym',
  description: 'Learn more about Milestone Energym, the premier fitness destination in Barmer. Meet our certified trainers and discover our world-class facilities.',
  alternates: {
    canonical: 'https://milestoneenergym.com/about',
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
