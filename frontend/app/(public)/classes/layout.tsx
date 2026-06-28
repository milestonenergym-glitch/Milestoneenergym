import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Classes & Group Workouts | Milestone Energym',
  description: 'Join our high-energy fitness classes at Milestone Energym. We offer CrossFit, Yoga, Zumba, HIIT, and functional training for all fitness levels.',
  alternates: {
    canonical: 'https://milestoneenergym.com/classes',
  }
}

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
