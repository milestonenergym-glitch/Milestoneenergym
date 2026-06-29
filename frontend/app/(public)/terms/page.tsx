"use client"

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function TermsConditionsPage() {
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
                Terms & Conditions
              </h1>
              <p className="text-brand-gold mt-2 text-sm font-semibold uppercase tracking-wider">
                Last Updated: June 2026
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-a:text-brand-gold">
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Welcome to Milestone Energym. By signing up for a membership or using our facilities, you agree to comply with and be bound by the following Terms & Conditions.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">1. Facility Usage and Rules</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Members must conduct themselves in a respectful manner towards staff and other members at all times.
            </p>
            <ul className="list-disc pl-6 text-white/60 space-y-2 mb-8">
              <li>Appropriate gym attire and clean sports shoes are mandatory.</li>
              <li>Equipment must be wiped down after use. Please replace weights and accessories to their designated racks.</li>
              <li>Dropping heavy weights and shouting excessively is strictly prohibited.</li>
              <li>Smoking, alcohol, and illegal substances are not allowed inside or around the gym premises.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">2. Liability Waiver</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Engaging in physical exercise involves inherent risks. By using the facilities of Milestone Energym, members agree that they are in good physical condition and have no medical reason preventing them from exercising. The gym and its management shall not be held liable for any personal injury, loss of property, or death occurring on the premises.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">3. Membership and Entry</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              Membership cards or digital IDs must be presented upon entry. Memberships are personal and cannot be shared or transferred. Management reserves the right to terminate the membership of anyone violating gym policies without a refund.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">4. Modifications to Terms</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Milestone Energym reserves the right to alter operating hours, class schedules, membership fees, and these Terms & Conditions at any time. Members will be notified of any significant changes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
