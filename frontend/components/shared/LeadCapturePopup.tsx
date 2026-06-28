'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitPopupLead } from '@/app/actions/leads'
import { Dumbbell, MapPin, Phone, Mail, User } from 'lucide-react'

export default function LeadCapturePopup() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if the user has already submitted the popup lead
    const hasSubmitted = localStorage.getItem('hasSubmittedPopupLead')
    if (!hasSubmitted) {
      // Show popup after 3 seconds of visiting the site
      const timer = setTimeout(() => {
        setShow(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      pincode: formData.get('pincode') as string,
    }

    const res = await submitPopupLead(data)
    
    if (res.success) {
      localStorage.setItem('hasSubmittedPopupLead', 'true')
      setShow(false)
    } else {
      setError(res.error || 'Failed to submit. Please try again.')
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop (Forced: No onClick close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl glass border border-white/10 shadow-[0_0_50px_rgba(15,82,186,0.2)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-600 p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading tracking-wider">Join The Elite</h2>
              <p className="text-blue-100 text-sm mt-1">Fill this out to get an exclusive Pre-launch offer!</p>
            </div>

            {/* Form */}
            <div className="p-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Mobile / WhatsApp Number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="Pincode"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3.5 mt-2 flex justify-center items-center font-bold text-[15px]"
                >
                  {loading ? 'Submitting...' : 'Submit & Continue'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
