'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Dumbbell, ArrowRight, Phone, Calendar } from 'lucide-react'

export default function CTABanner() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      id="cta-banner"
      aria-label="Call to action"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 gradient-animate"
        style={{ backgroundSize: '400% 400%' }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-8">
            <Dumbbell className="w-4 h-4 text-brand-gold" />
            Limited Spots Available This Month
          </div>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none tracking-tight">
            YOUR JOURNEY
            <span className="block text-gradient">STARTS TODAY</span>
          </h2>

          <p className="text-white/70 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Join 2,000+ members who already transformed their lives at Milestone Energym.
            First step is always the hardest — we'll take it with you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/membership"
              className="group flex items-center gap-3 bg-white text-brand-blue font-bold text-lg px-10 py-4 rounded-2xl hover:bg-brand-gold hover:text-black transition-all hover:-translate-y-1 shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
              id="cta-join-now"
            >
              <Dumbbell className="w-5 h-5" />
              Join Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/#free-trial"
              className="flex items-center gap-3 border-2 border-white/30 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1"
              id="cta-free-trial"
            >
              <Calendar className="w-5 h-5" />
              Book Free Trial
            </Link>

            <a
              href="tel:+918875305442"
              className="flex items-center gap-3 text-white/70 hover:text-white font-medium text-lg transition-colors"
              id="cta-call"
            >
              <Phone className="w-5 h-5" />
              +91 88753 05442
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
