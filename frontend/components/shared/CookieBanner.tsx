'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie } from 'lucide-react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Delay to avoid layout shift
      setTimeout(() => setVisible(true), 2000)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const declineNonEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999]"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="glass rounded-2xl p-5 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <h3 className="text-sm font-semibold text-white">Cookie Preferences</h3>
              </div>
              <button
                onClick={declineNonEssential}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              We use cookies to enhance your experience, analyze traffic, and personalize content.
              See our{' '}
              <Link href="/cookie-policy" className="text-brand-blue-300 hover:underline">
                Cookie Policy
              </Link>{' '}
              for more.
            </p>
            <div className="flex gap-2">
              <button
                onClick={acceptAll}
                className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg hover:opacity-90 transition-opacity"
                id="cookie-accept-all"
              >
                Accept All
              </button>
              <button
                onClick={declineNonEssential}
                className="flex-1 border border-white/10 text-white/70 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                id="cookie-essential-only"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
