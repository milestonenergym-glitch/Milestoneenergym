'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Sun, Moon, Phone, Dumbbell } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { getGymSettings } from '@/app/actions/settings'

/* ─── Navigation Structure ─── */
const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Membership',
    href: '/membership',
    children: [
      { label: 'Plans & Pricing', href: '/membership' },
      { label: 'Compare Plans', href: '/membership#compare' },
      { label: 'Corporate Membership', href: '/membership#corporate' },
      { label: 'Student Membership', href: '/membership#student' },
      { label: 'Family Membership', href: '/membership#family' },
    ],
  },
  {
    label: 'Programs',
    href: '/classes',
    children: [
      { label: 'All Classes', href: '/classes' },
      { label: 'Personal Training', href: '/personal-training' },
      { label: 'CrossFit', href: '/classes#crossfit' },
      { label: 'Yoga', href: '/classes#yoga' },
      { label: 'Cardio Zone', href: '/classes#cardio' },
    ],
  },
  {
    label: 'Fitness Tools',
    href: '/bmi-calculator',
    children: [
      { label: 'BMI Calculator', href: '/bmi-calculator' },
      { label: 'Calories Calculator', href: '/calories-calculator' },
      { label: 'Diet Plans', href: '/diet-plans' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    getGymSettings().then(data => setSettings(data))
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
          scrolled
            ? 'glass border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        )}
        style={{ height: 'var(--nav-height, 80px)' }}
      >
        <div className="container-custom h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="Milestone Energym — Home"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/logo.jpg"
                alt="Milestone Energym Logo"
                fill
                className="object-contain"
                style={{ clipPath: 'circle(45% at 50% 50%)' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children ? (
                  <button
                    className={cn(
                      'nav-link flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5',
                      pathname.startsWith(link.href) && 'text-white'
                    )}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === link.label}
                    id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200',
                        activeDropdown === link.label && 'rotate-180'
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'nav-link px-3 py-2 rounded-lg hover:bg-white/5 block',
                      pathname === link.href && 'text-white'
                    )}
                    id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 pt-2 min-w-[200px]"
                        role="menu"
                      >
                        <div className="glass rounded-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                              role="menuitem"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </button>

            {/* Phone */}
            <a
              href={`tel:${settings?.contactPhone?.replace(/[^0-9+]/g, '') || '+918875305442'}`}
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              aria-label="Call us"
              id="nav-phone"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-medium tracking-wide">
                {settings?.contactPhone || '+91 88753 05442'}
              </span>
            </a>

            {/* Free Trial CTA */}
            <Link
              href="/#free-trial"
              className="hidden md:inline-flex btn-primary text-sm py-2.5 px-4"
              id="nav-free-trial-cta"
            >
              <Dumbbell className="w-4 h-4" />
              Free Trial
            </Link>

            {/* Member Login */}
            <Link
              href="/login"
              className="btn-outline text-sm py-2.5 px-4"
              id="nav-login"
            >
              Login
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[99] w-[300px] bg-[#0F0F0F] border-l border-white/10 flex flex-col lg:hidden overflow-y-auto"
              role="dialog"
              aria-label="Mobile navigation"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                  <div className="relative w-16 h-16">
                    <Image src="/logo.jpg" alt="Milestone Energym" fill className="object-contain" />
                  </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 p-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.children ? (
                      <div>
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                          onClick={() =>
                            setActiveDropdown(activeDropdown === link.label ? null : link.label)
                          }
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform',
                              activeDropdown === link.label && 'rotate-180'
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <div className="p-5 border-t border-white/10 space-y-3">
                <Link
                  href="/#free-trial"
                  className="btn-primary w-full justify-center py-3"
                  id="mobile-free-trial"
                >
                  Book Free Trial
                </Link>
                <Link
                  href="/login"
                  className="btn-outline w-full justify-center py-3"
                  id="mobile-login"
                >
                  Member Login
                </Link>
                <a
                  href="tel:+918875305442"
                  className="flex items-center justify-center gap-2 text-white/60 text-sm hover:text-white transition-colors py-2"
                >
                  <Phone className="w-4 h-4" />
                  +91 88753 05442
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
