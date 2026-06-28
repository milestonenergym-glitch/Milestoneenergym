'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowRight, Award } from 'lucide-react'

const defaultTrainers = [
  {
    id: 't1',
    name: 'Rahul Singh',
    specialty: 'CrossFit & Strength Coach',
    experience: '8 Years',
    certifications: ['CrossFit L3', 'NSCA-CSCS', 'Nutrition Coach'],
    instagram: 'https://instagram.com',
    image: '/images/trainer-1.jpg',
    gradient: 'from-brand-blue/30 to-transparent',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    specialty: 'Yoga & Mindfulness',
    experience: '6 Years',
    certifications: ['RYT 500', 'Pilates Certified', 'Meditation Guide'],
    instagram: 'https://instagram.com',
    image: '/images/trainer-2.jpg',
    gradient: 'from-brand-gold/20 to-transparent',
  },
  {
    id: 't3',
    name: 'Arjun Mehta',
    specialty: 'Powerlifting & Bodybuilding',
    experience: '10 Years',
    certifications: ['ACSM-CPT', 'IPF Judge', 'Sports Nutrition'],
    instagram: 'https://instagram.com',
    image: '/images/trainer-3.jpg',
    gradient: 'from-brand-blue/30 to-transparent',
  },
  {
    id: 't4',
    name: 'Anjali Patel',
    specialty: 'Cardio & Weight Loss',
    experience: '5 Years',
    certifications: ['ACE-CPT', 'Zumba Instructor', 'Nutrition Coach'],
    instagram: 'https://instagram.com',
    image: '/images/trainer-4.jpg',
    gradient: 'from-brand-gold/20 to-transparent',
  },
]

export default function TrainersSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [dbTrainers, setDbTrainers] = useState<any[]>([])

  useEffect(() => {
    import('@/app/actions/trainers').then(({ getTrainerProfiles }) => {
      getTrainerProfiles().then(data => {
        setDbTrainers(data)
      })
    })
  }, [])

  const activeTrainers = dbTrainers.length > 0 ? dbTrainers.map((t, index) => ({
    id: t.id,
    name: t.user?.name || 'Trainer',
    specialty: t.specialization || 'General Trainer',
    experience: `${t.experienceYears} Years`,
    certifications: t.bio ? [t.bio] : ['Certified Trainer'],
    instagram: '#',
    image: t.user?.image || `/images/trainer-${(index % 4) + 1}.jpg`,
    gradient: index % 2 === 0 ? 'from-brand-blue/30 to-transparent' : 'from-brand-gold/20 to-transparent'
  })) : defaultTrainers

  return (
    <section
      className="section-padding bg-[#080808] relative overflow-hidden"
      id="trainers"
      aria-labelledby="trainers-heading"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl" />

      <div className="container-custom" ref={ref}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="section-label mb-3 inline-block"
            >
              Expert Team
            </motion.span>
            <motion.h2
              id="trainers-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Meet Our <span className="text-gradient">Elite Trainers</span>
            </motion.h2>
          </div>
          <Link href="/personal-training" className="flex items-center gap-2 text-brand-blue-300 hover:text-white text-sm font-medium transition-colors" id="view-all-trainers">
            Book Personal Training <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTrainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
              id={`trainer-${trainer.id}`}
            >
              {/* Image Placeholder with gradient */}
              <div className={`relative h-56 bg-gradient-to-b ${trainer.gradient} from-gray-800 to-gray-900 overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl font-bold">
                  {trainer.name[0]}
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                {/* Instagram Button */}
                <a
                  href={trainer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  aria-label={`${trainer.name} Instagram`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Experience badge */}
                <div className="absolute top-3 left-3 badge-blue text-xs">
                  {trainer.experience}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-brand-gold transition-colors">
                  {trainer.name}
                </h3>
                <p className="text-white/50 text-sm mb-4">{trainer.specialty}</p>

                <div className="space-y-1.5">
                  {trainer.certifications.map((cert) => (
                    <div key={cert} className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-brand-gold flex-shrink-0" />
                      <span className="text-white/40 text-xs">{cert}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-5 w-full py-2.5 rounded-xl border border-brand-blue/30 text-brand-blue-300 text-sm font-medium hover:bg-brand-blue/10 transition-colors" id={`book-trainer-${trainer.id}`}>
                  Book Session
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
