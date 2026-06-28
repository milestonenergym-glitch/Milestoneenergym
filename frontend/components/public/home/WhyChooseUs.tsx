'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Dumbbell, Heart, Apple, Activity, Zap, Target, Flame,
  Users, User, Lock, ShieldCheck, Car, Wind, Thermometer, Camera,
} from 'lucide-react'

const features = [
  { id: 'imported-machines', icon: Dumbbell, title: 'Imported Machines', desc: 'World-class equipment from leading brands', color: '#0F52BA' },
  { id: 'certified-trainers', icon: Users, title: 'Certified Trainers', desc: 'Internationally certified fitness professionals', color: '#D4AF37' },
  { id: 'diet-support', icon: Apple, title: 'Diet Support', desc: 'Personalized nutrition guidance & meal plans', color: '#22C55E' },
  { id: 'cardio-zone', icon: Activity, title: 'Cardio Zone', desc: 'Advanced treadmills, cycles & ellipticals', color: '#EF4444' },
  { id: 'crossfit', icon: Zap, title: 'CrossFit', desc: 'High-intensity functional training programs', color: '#F59E0B' },
  { id: 'strength-zone', icon: Dumbbell, title: 'Strength Zone', desc: 'Free weights, barbells & power racks', color: '#0F52BA' },
  { id: 'functional-training', icon: Target, title: 'Functional Training', desc: 'TRX, battle ropes & kettlebells', color: '#8B5CF6' },
  { id: 'yoga', icon: Heart, title: 'Yoga', desc: 'Dedicated yoga studio with expert instructors', color: '#EC4899' },
  { id: 'personal-training', icon: User, title: 'Personal Training', desc: 'One-on-one sessions for faster results', color: '#D4AF37' },
  { id: 'locker', icon: Lock, title: 'Locker Rooms', desc: 'Secure lockers for your belongings', color: '#6B7280' },
  { id: 'changing-room', icon: ShieldCheck, title: 'Changing Room', desc: 'Clean and spacious changing facilities', color: '#0F52BA' },
  { id: 'parking', icon: Car, title: 'Free Parking', desc: 'Ample parking space for all members', color: '#10B981' },
  { id: 'hygiene', icon: Flame, title: 'Hygiene Standards', desc: 'Sanitized daily — your health is our priority', color: '#14B8A6' },
  { id: 'ac', icon: Thermometer, title: 'Air Conditioned', desc: 'Fully climate-controlled for comfort', color: '#3B82F6' },
  { id: 'cctv', icon: Camera, title: 'CCTV Security', desc: '24/7 surveillance for your safety', color: '#D4AF37' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="section-padding bg-[#0A0A0A] relative overflow-hidden"
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
    >
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="section-label">World-Class Facilities</span>
          </motion.div>

          <motion.h2
            id="why-choose-us-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5"
          >
            Why Choose{' '}
            <span className="text-gradient">Milestone Energym?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to achieve your fitness goals under one premium roof.
            We invest in the best so you can perform your best.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="card-premium group cursor-default"
                id={`feature-${feature.id}`}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>

                {/* Text */}
                <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-brand-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  {feature.desc}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
