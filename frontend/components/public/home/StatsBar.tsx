'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { Users, Trophy, Dumbbell, Star, Clock } from 'lucide-react'

const stats = [
  {
    id: 'total-members',
    icon: Users,
    value: 2000,
    suffix: '+',
    label: 'Total Members',
    color: '#0F52BA',
  },
  {
    id: 'certified-trainers',
    icon: Trophy,
    value: 15,
    suffix: '+',
    label: 'Certified Trainers',
    color: '#D4AF37',
  },
  {
    id: 'gym-equipment',
    icon: Dumbbell,
    value: 150,
    suffix: '+',
    label: 'Premium Equipment',
    color: '#0F52BA',
  },
  {
    id: 'google-rating',
    icon: Star,
    value: 4.8,
    suffix: '',
    decimals: 1,
    label: 'Google Rating',
    color: '#D4AF37',
  },
  {
    id: 'years-experience',
    icon: Clock,
    value: 8,
    suffix: '+',
    label: 'Years of Excellence',
    color: '#0F52BA',
  },
]

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section
      ref={ref}
      className="relative z-10 py-0"
      aria-label="Gym statistics"
      id="stats"
    >
      <div className="container-custom">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative -mt-14 glass-dark rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/8 divide-y md:divide-y-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-7 px-4 group hover:bg-white/[0.03] transition-colors"
                  id={`stat-${stat.id}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>

                  <div className="text-3xl md:text-4xl font-display font-bold leading-none mb-1"
                    style={{
                      background: `linear-gradient(135deg, #fff 30%, ${stat.color} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {inView && (
                      <CountUp
                        end={stat.value}
                        decimals={stat.decimals || 0}
                        duration={2}
                        delay={index * 0.1}
                      />
                    )}
                    {stat.suffix}
                  </div>

                  <div className="text-white/50 text-xs font-medium text-center tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
