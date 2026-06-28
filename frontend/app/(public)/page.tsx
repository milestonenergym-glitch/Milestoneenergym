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

export const metadata: Metadata = {
  title: 'Milestone Energym — Train Hard. Stay Strong. | Premium Fitness Center',
  description:
    'Join Milestone Energym — a premium fitness center with imported machines, certified trainers, CrossFit, Yoga, Personal Training & flexible memberships. Book your free trial today!',
  openGraph: {
    title: 'Milestone Energym — Train Hard. Stay Strong.',
    description: 'Premium fitness center with certified trainers, imported machines & flexible memberships.',
  },
}

export default async function HomePage() {
  const settings = await getGymSettings()

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
