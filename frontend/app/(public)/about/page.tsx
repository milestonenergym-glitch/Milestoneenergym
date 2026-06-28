"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dumbbell, Target, Users, Zap, Shield, Trophy } from 'lucide-react'

const stats = [
  { label: 'Active Members', value: '2000+' },
  { label: 'Expert Trainers', value: '15+' },
  { label: 'Classes per Week', value: '50+' },
  { label: 'Years Experience', value: '10+' },
]

const values = [
  {
    icon: <Dumbbell className="w-6 h-6" />,
    title: 'Premium Equipment',
    description: 'State-of-the-art machines from top global brands.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community First',
    description: 'A supportive environment that pushes you to be your best.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Goal Oriented',
    description: 'Personalized programs designed to hit your specific targets.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Safe Environment',
    description: 'Strict hygiene protocols and professional supervision.'
  }
]

const trainers = [
  {
    name: 'Marcus Thorne',
    role: 'Head Strength Coach',
    image: 'https://i.pravatar.cc/300?img=11'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Yoga & Pilates',
    image: 'https://i.pravatar.cc/300?img=5'
  },
  {
    name: 'David Chen',
    role: 'CrossFit Expert',
    image: 'https://i.pravatar.cc/300?img=12'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Nutrition Specialist',
    image: 'https://i.pravatar.cc/300?img=9'
  }
]

import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [dbTrainers, setDbTrainers] = useState<any[]>([])

  useEffect(() => {
    import('@/app/actions/trainers').then(({ getTrainerProfiles }) => {
      getTrainerProfiles().then(data => {
        setDbTrainers(data)
      })
    })
  }, [])

  const displayTrainers = dbTrainers.length > 0 ? dbTrainers.map(t => ({
    name: t.name,
    role: t.specialization || 'Milestone Trainer',
    image: t.imageUrl || 'https://i.pravatar.cc/300?img=11'
  })) : trainers
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-[120px] pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.png"
            alt="Milestone Energym Interior"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 to-[#0A0A0A]"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight text-white uppercase">
              Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-600">Fitness</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
              We are more than just a gym. We are a community of dedicated individuals striving for excellence in health, strength, and mindset.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2 font-heading">{stat.value}</div>
                <div className="text-sm text-white/60 uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 uppercase">Our <span className="text-brand-blue-400">Story</span></h2>
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                Founded with a vision to bring world-class fitness facilities to everyone, Milestone Energym started as a passionate idea and has grown into a premier fitness destination.
              </p>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                We believe that fitness is not a destination, but a journey. Our facility is designed to inspire, motivate, and push you beyond your perceived limits, whether you are a beginner or a seasoned athlete.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Premium imported equipment',
                  'Certified expert trainers',
                  'Vibrant fitness community',
                  'Holistic approach to health'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[600px] rounded-2xl overflow-hidden glass border border-white/10"
            >
              <Image
                src="/about-story.png"
                alt="Heavy dumbbells in gym"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 uppercase">Why Choose <span className="text-brand-gold">Us</span></h2>
            <p className="text-white/60 text-lg">We provide an unparalleled fitness experience focused on your results and well-being.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors text-white/70">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 uppercase">Meet Our <span className="text-brand-blue-400">Experts</span></h2>
              <p className="text-white/60 text-lg">Our elite team of certified trainers are here to guide, motivate, and push you to achieve your absolute best.</p>
            </div>
            <button className="btn-outline shrink-0">View All Trainers</button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTrainers.slice(0, 4).map((trainer, index) => (
              <motion.div
                key={trainer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden glass border border-white/5"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                  <p className="text-brand-gold text-sm font-semibold uppercase tracking-wider">{trainer.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
