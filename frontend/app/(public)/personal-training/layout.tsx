import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personal Training | Milestone Energym',
  description: 'Achieve your fitness goals faster with 1-on-1 personal training at Milestone Energym. Our certified trainers provide custom workout and diet plans.',
  alternates: {
    canonical: 'https://milestoneenergym.com/personal-training',
  }
}

export default function PersonalTrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
