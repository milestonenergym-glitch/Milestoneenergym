"use client"

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-3xl border border-white/10"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading uppercase tracking-tight">
                Refund & Cancellation Policy
              </h1>
              <p className="text-brand-gold mt-2 text-sm font-semibold uppercase tracking-wider">
                Last Updated: June 2026
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-a:text-brand-gold">
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              At Milestone Energym, we strive to provide the best fitness experience. Please read our refund and cancellation policy carefully before making any purchases or commitments.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">1. Membership Fees</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              All membership fees are non-refundable and non-transferable under normal circumstances. Once a membership is purchased, it cannot be canceled for a refund, except for certain medical emergencies.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">2. Medical Exceptions</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              If a member becomes medically unable to use the gym facilities, they may request a freeze or a pro-rated refund. A valid medical certificate from a registered medical practitioner must be provided. Approval of refunds under this category is at the sole discretion of the Milestone Energym management.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">3. Personal Training Packages</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Personal Training (PT) sessions and packages are strictly non-refundable. If you cannot attend a scheduled session, you must inform your trainer at least 24 hours in advance to reschedule. Failure to do so may result in the forfeiture of that session.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">4. Freezing Memberships</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Annual memberships may be frozen for a maximum of 30 days due to travel or health reasons, provided the request is made in writing before the period of absence. Retrospective freezing will not be allowed.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">5. Contact Information</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              For any refund or cancellation queries, please speak to the front desk at our Barmer location or email us at <a href="mailto:contact@milestoneenergym.com">contact@milestoneenergym.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
