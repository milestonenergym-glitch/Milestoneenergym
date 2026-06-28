'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  { id: 't1', name: 'Sanjay Kumar', role: 'Software Engineer', rating: 5, text: "Milestone Energym completely transformed my life. Lost 18kg in 4 months with the perfect combination of training and diet guidance from their amazing trainers. Best gym in the city!", since: 'Member since 2022', avatar: 'S' },
  { id: 't2', name: 'Meera Krishnan', role: 'Marketing Manager', rating: 5, text: "The CrossFit sessions are incredible! The trainers are certified, the equipment is world-class, and the atmosphere is motivating. I've never felt stronger or more confident.", since: 'Member since 2023', avatar: 'M' },
  { id: 't3', name: 'Rajesh Verma', role: 'Business Owner', rating: 5, text: "As someone with a hectic schedule, the flexible membership and 5 AM opening time is a lifesaver. The personal training team built me a custom program that fits my life perfectly.", since: 'Member since 2021', avatar: 'R' },
  { id: 't4', name: 'Priya Nair', role: 'Doctor', rating: 5, text: "After my pregnancy, I was struggling to get back in shape. The trainers at Milestone were understanding, professional, and crafted the perfect postnatal fitness program. Results speak for themselves!", since: 'Member since 2023', avatar: 'P' },
  { id: 't5', name: 'Arjun Kapoor', role: 'IT Professional', rating: 5, text: "The gym facilities are top-notch — clean, air-conditioned, with imported equipment. But what sets them apart is the trainer quality and the community vibe. Highly recommend!", since: 'Member since 2022', avatar: 'A' },
]

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const prev = () => { setIsAutoPlaying(false); setCurrent(p => (p - 1 + testimonials.length) % testimonials.length) }
  const next = () => { setIsAutoPlaying(false); setCurrent(p => (p + 1) % testimonials.length) }

  return (
    <section
      className="section-padding bg-[#080808] relative overflow-hidden"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />

      <div className="container-custom" ref={ref}>
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="section-label mb-4 inline-block"
          >
            Member Stories
          </motion.span>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Real Results, <span className="text-gradient-gold">Real People</span>
          </motion.h2>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden"
                id={`testimonial-${testimonials[current].id}`}
              >
                {/* Quote mark */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-gold/10" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                <blockquote className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 italic">
                  "{testimonials[current].text}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-gold flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonials[current].name}</div>
                    <div className="text-white/40 text-sm">{testimonials[current].role}</div>
                    <div className="text-brand-gold/60 text-xs mt-0.5">{testimonials[current].since}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-brand-blue/40 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIsAutoPlaying(false); setCurrent(i) }}
                  className={`rounded-full transition-all ${
                    i === current
                      ? 'w-6 h-2 bg-brand-gold'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-brand-blue/40 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <a
            href="https://g.page/r/milestoneenergym/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass border border-white/10 text-white/70 hover:text-white hover:border-brand-gold/30 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
            id="leave-google-review"
          >
            <Star className="w-4 h-4 text-brand-gold" />
            Leave a Google Review
          </a>
        </motion.div>
      </div>
    </section>
  )
}
