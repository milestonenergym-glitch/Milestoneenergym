import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import FloatingButtons from '@/components/shared/FloatingButtons'
import HeroSection from '@/components/public/home/HeroSection'
import StatsBar from '@/components/public/home/StatsBar'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import MembershipPreview from '@/components/public/home/MembershipPreview'
import ClassSchedule from '@/components/public/home/ClassSchedule'
import TrainersSection from '@/components/public/home/TrainersSection'
import TestimonialsSection from '@/components/public/home/TestimonialsSection'
import TransformationsSection from '@/components/public/home/TransformationsSection'
import BMIWidget from '@/components/public/home/BMIWidget'
import FreeTrialForm from '@/components/public/home/FreeTrialForm'
import BlogPreview from '@/components/public/home/BlogPreview'
import GoogleMapSection from '@/components/public/home/GoogleMapSection'
import CTABanner from '@/components/public/home/CTABanner'
import { getGymSettings } from '@/app/actions/settings'
import { preload } from 'react-dom'

export const metadata: Metadata = {
  title: 'Milestone Energym | Best Gym in Barmer | Fitness Center',
  description:
    'Join Milestone Energym — the best gym in Barmer. A premium fitness center offering imported machines, certified trainers, CrossFit, Yoga, Personal Training, and Weight Loss programs. Book your free trial today!',
  keywords: [
    'Milestone Energym',
    'milestone gym',
    'milestone gym Barmer',
    'Best Gym in Barmer',
    'Gym Near Me',
    'Fitness Center',
    'Personal Training',
    'Strength Training',
    'Weight Loss Gym',
    'Bodybuilding Gym',
    'Functional Training'
  ],
  openGraph: {
    title: 'Milestone Energym | Best Gym in Barmer',
    description: 'Transform your body at Barmer\'s most premium fitness center. Join Milestone Energym today.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://milestoneenergym.com',
  }
}

export default async function HomePage() {
  const settings = await getGymSettings()
  
  // Preload hero background image for LCP optimization
  preload('/about-hero.png', { as: 'image' })

  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar settings={settings} />
      <WhyChooseUs />
      <MembershipPreview />
      <ClassSchedule />
      <TrainersSection />
      <TestimonialsSection />
      <TransformationsSection />
      <BMIWidget />
      <FreeTrialForm />
      <BlogPreview />
      <GoogleMapSection />
      <CTABanner settings={settings} />
      <Footer />
      <FloatingButtons />
    </main>
  )
}
