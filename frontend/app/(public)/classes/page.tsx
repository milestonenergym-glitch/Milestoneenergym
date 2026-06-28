"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getClasses } from '@/app/actions/classes'

const programs = [
  {
    id: 'strength',
    title: 'Strength & Conditioning',
    description: 'Build muscle, increase power, and transform your physique with our elite strength training area. Featuring Olympic lifting platforms and premium equipment.',
    image: '/class-strength.png',
    intensity: 'High',
    duration: '60 Min',
    capacity: 'Open Floor',
    color: 'from-brand-gold-600 to-brand-gold-400'
  },
  {
    id: 'crossfit',
    title: 'CrossFit Intensity',
    description: 'High-intensity interval training that pushes your limits. Combining weightlifting, gymnastics, and metabolic conditioning for ultimate fitness.',
    image: '/class-crossfit.png',
    intensity: 'Extreme',
    duration: '45 Min',
    capacity: '15 People',
    color: 'from-red-600 to-orange-500'
  },
  {
    id: 'yoga',
    title: 'Yoga & Mobility',
    description: 'Find your center, improve flexibility, and build core strength in our serene, climate-controlled studio. Suitable for all experience levels.',
    image: '/class-yoga.png',
    intensity: 'Low/Medium',
    duration: '60 Min',
    capacity: '20 People',
    color: 'from-brand-blue-600 to-teal-400'
  },
  {
    id: 'cardio',
    title: 'Endurance Cardio',
    description: 'State-of-the-art treadmills, ellipticals, and rowers with immersive screens to make your cardiovascular training engaging and effective.',
    image: '/class-cardio.png',
    intensity: 'Medium/High',
    duration: 'Self-paced',
    capacity: 'Open Floor',
    color: 'from-cyan-600 to-blue-500'
  }
]

export default function ClassesPage() {
  const [dbClasses, setDbClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getClasses()
      setDbClasses(data)
      setLoading(false)
    }
    load()
  }, [])

  // Merge DB data with static display data if available, or just show DB data.
  // Since DB classes don't have images, we'll assign a random static image from programs.
  const displayClasses = dbClasses.length > 0 ? dbClasses.map((cls, idx) => {
    const staticProgram = programs[idx % programs.length]
    return {
      ...staticProgram,
      id: cls.id,
      title: cls.name,
      description: cls.description || staticProgram.description,
      capacity: `${cls.capacity} Members`,
      duration: cls.scheduleTime
    }
  }) : programs

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Our <span className="text-brand-blue-400">Programs</span>
          </h1>
          <p className="text-lg text-white/60">
            From high-intensity CrossFit to calming Yoga, our expertly designed programs cater to every fitness goal and experience level.
          </p>
        </motion.div>
      </div>

      {/* Programs List */}
      <div className="container-custom">
        <div className="space-y-24">
          {loading ? (
             <div className="text-center py-20 text-white/50 animate-pulse">Loading classes...</div>
          ) : displayClasses.map((program, index) => (
            <div 
              key={program.id} 
              id={program.id}
              className={`flex flex-col gap-8 lg:gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 !== 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 group">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80`}></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-sm font-semibold uppercase tracking-wider">
                    {program.intensity} Intensity
                  </div>
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full lg:w-1/2"
              >
                <h2 className={`text-3xl md:text-4xl font-bold font-heading mb-4 text-transparent bg-clip-text bg-gradient-to-r ${program.color}`}>
                  {program.title}
                </h2>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  {program.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="glass p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-gold" />
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">Duration</div>
                      <div className="font-semibold">{program.duration}</div>
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <Users className="w-5 h-5 text-brand-gold" />
                    <div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">Capacity</div>
                      <div className="font-semibold">{program.capacity}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/membership" className="btn-primary group">
                    Join Plan
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/contact" className="btn-outline">
                    Request Info
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Schedule Callout */}
      <div className="container-custom mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass rounded-3xl p-10 md:p-16 border border-brand-gold/30 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5"></div>
          <Calendar className="w-16 h-16 text-brand-gold mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 uppercase relative z-10">
            View Full <span className="text-brand-gold">Schedule</span>
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto relative z-10">
            Our classes run from 5:00 AM to 10:00 PM every day. Check our live schedule to find a time that works for you and book your spot.
          </p>
          <Link href="/contact" className="btn-primary relative z-10">
            Get The Schedule
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
