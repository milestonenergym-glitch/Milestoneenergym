'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTestimonials } from '@/app/actions/testimonials'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getTestimonials()
      // Only show active testimonials
      setTestimonials(data.filter((t: any) => t.isActive))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Member <span className="text-brand-gold">Stories</span>
          </h1>
          <p className="text-lg text-white/60">
            Don't just take our word for it. Hear what our community has to say about their transformation journey at Milestone Energym.
          </p>
        </motion.div>
      </div>

      <div className="container-custom">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3">Check back soon!</h3>
            <p className="text-white/60">We are currently gathering incredible stories from our members. Check back later to read their reviews.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl border border-white/5 relative"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? 'text-brand-gold fill-brand-gold'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-white/80 leading-relaxed mb-8 relative z-10 italic">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto relative z-10">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/10">
                    <Image
                      src={t.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-brand-gold">{t.role || 'Member'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
