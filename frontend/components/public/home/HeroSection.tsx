'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown,
  Play,
  Phone,
  MessageCircle,
  Dumbbell,
  Calendar,
  Zap,
} from 'lucide-react'
import { getGymSettings } from '@/app/actions/settings'

const headlines = [
  'Train Hard.',
  'Stay Strong.',
  'Transform Now.',
]

export default function HeroSection() {
  const [currentHeadline, setCurrentHeadline] = useState(0)
  const [currentBg, setCurrentBg] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [settings, setSettings] = useState<any>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const [dbBanners, setDbBanners] = useState<any[]>([])

  const defaultHeadlines = [
    'Train Hard.',
    'Stay Strong.',
    'Transform Now.',
  ]

  const defaultBackgrounds = [
    '/about-hero.png',
    '/class-strength.png',
    '/class-cardio.png',
    '/class-crossfit.png'
  ]

  useEffect(() => {
    getGymSettings().then(data => setSettings(data))
    import('@/app/actions/hero').then(({ getHeroBanners }) => {
      getHeroBanners().then(data => {
        const activeBanners = data.filter((b: any) => b.isActive)
        setDbBanners(activeBanners)
      })
    })
  }, [])

  const activeHeadlines = dbBanners.length > 0 
    ? dbBanners.map(b => b.title || 'Train Hard.')
    : defaultHeadlines
    
  const activeBackgrounds = dbBanners.length > 0
    ? dbBanners.map(b => b.imageUrl)
    : defaultBackgrounds

  // Cycle through headlines and backgrounds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeadline(prev => (prev + 1) % activeHeadlines.length)
      setCurrentBg(prev => (prev + 1) % activeBackgrounds.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeHeadlines.length, activeBackgrounds.length])

  // Parallax mouse effect
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px) scale(1.05)`,
        }}
      >
        {/* Animated gradient background fallback (Must be behind images) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a1a] to-[#0a050a]" />

        {/* Animated Background Images */}
        {activeBackgrounds.map((bg, index) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              currentBg === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${bg}')`,
            }}
          />
        ))}

        {/* Blue energy particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? '#0F52BA' : '#D4AF37',
                opacity: 0.4,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Grid overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(15,82,186,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,82,186,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 text-center px-4">

        {/* Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="badge-gold">
            <Zap className="w-3 h-3" />
            Premium Fitness Center
          </div>
        </motion.div>

        {/* Animated Headline */}
        <div className="mb-6 overflow-hidden">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-white">
              MILESTONE <span className="text-gradient">ENERGYM</span>
            </h1>
          </motion.div>

          {/* Cycling sub-headline */}
          <div className="h-[clamp(3rem,7vw,5.5rem)] overflow-hidden relative">
            {activeHeadlines.map((line, i) => (
              <motion.div
                key={`headline-${i}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: 80, opacity: 0 }}
                animate={{
                  y: currentHeadline === i ? 0 : currentHeadline > i ? -80 : 80,
                  opacity: currentHeadline === i ? 1 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-gradient">
                  {line}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          State-of-the-art equipment. Certified trainers. A community that pushes you further than you ever imagined.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          {/* Primary: Join Now */}
          <Link
            href="/membership"
            className="relative group w-full sm:w-auto"
            id="hero-join-now"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-gold rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
            <button className="relative w-full sm:w-auto bg-gradient-to-r from-brand-blue to-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform">
              <Dumbbell className="w-5 h-5" />
              Join Now
            </button>
          </Link>

          {/* Secondary: Free Trial */}
          <a
            href="/#free-trial"
            className="gradient-border w-full sm:w-auto"
            id="hero-free-trial"
          >
            <button className="w-full sm:w-auto glass text-white font-semibold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <Calendar className="w-5 h-5 text-brand-gold" />
              Book Free Trial
            </button>
          </a>

          {/* Call */}
          <a
            href={`tel:${settings?.contactPhone?.replace(/[^0-9+]/g, '') || '+918875305442'}`}
            className="w-full sm:w-auto"
            id="hero-call"
          >
            <button className="w-full sm:w-auto border border-white/15 text-white font-semibold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <Phone className="w-5 h-5" />
              Call Now
            </button>
          </a>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/30 text-xs tracking-widest uppercase"
        >
          <span>Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Play Video Button — Optional */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 glass px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all group"
        aria-label="Watch gym tour video"
        id="hero-play-video"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-blue/30 transition-colors">
          <Play className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <span className="text-sm font-medium">Watch Tour</span>
      </motion.button>
    </section>
  )
}
