'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const transformations = [
  { id: 'tr1', name: 'Suresh P.', goal: 'Weight Loss', lost: '22kg', duration: '5 months', before: '/images/before-1.jpg', after: '/images/after-1.jpg' },
  { id: 'tr2', name: 'Divya M.', goal: 'Muscle Gain', lost: '+8kg muscle', duration: '6 months', before: '/images/before-2.jpg', after: '/images/after-2.jpg' },
  { id: 'tr3', name: 'Karan S.', goal: 'Body Transformation', lost: '15kg', duration: '4 months', before: '/images/before-3.jpg', after: '/images/after-3.jpg' },
]

function BeforeAfterSlider({ transformation }: { transformation: typeof transformations[0] }) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPos(x)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100))
    setSliderPos(x)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-64 rounded-xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      aria-label={`Before and after transformation for ${transformation.name}`}
    >
      {/* After (right side — background) */}
      <div
        className="absolute inset-0 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a2a0a, #0a1a0a)' }}
      >
        <span className="text-green-400/20 text-6xl font-bold">AFTER</span>
      </div>

      {/* Before (left side — clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2a0a0a, #1a0a0a)' }}
        >
          <span className="text-red-400/20 text-6xl font-bold">BEFORE</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">BEFORE</div>
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-green-400 text-xs font-bold px-2 py-1 rounded">AFTER</div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gray-400 rounded" />
            <div className="w-0.5 h-4 bg-gray-400 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransformationsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="section-padding bg-[#0A0A0A]"
      id="transformations"
      aria-labelledby="transformations-heading"
    >
      <div className="container-custom" ref={ref}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="section-label mb-3 inline-block">
              Real Transformations
            </motion.span>
            <motion.h2
              id="transformations-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Success <span className="text-gradient">Stories</span>
            </motion.h2>
          </div>
          <a href="/transformations" className="flex items-center gap-2 text-brand-blue-300 hover:text-white text-sm font-medium transition-colors" id="view-all-transformations">
            View All Transformations <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transformations.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className="glass rounded-2xl overflow-hidden border border-white/8"
              id={`transformation-${t.id}`}
            >
              <BeforeAfterSlider transformation={t} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">{t.name}</h3>
                  <span className="badge-gold">{t.goal}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <div className="text-white/40 text-xs">Result</div>
                    <div className="text-green-400 font-semibold">{t.lost}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">Duration</div>
                    <div className="text-white font-semibold">{t.duration}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
