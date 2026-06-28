import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym Gallery & Facility | Milestone Energym',
  description: 'Take a tour of Milestone Energym. Explore our premium gym equipment, CrossFit area, Yoga studio, and luxurious facilities.',
  alternates: {
    canonical: 'https://milestoneenergym.com/gallery',
  }
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
