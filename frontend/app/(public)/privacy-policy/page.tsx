"use client"

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-brand-gold mt-2 text-sm font-semibold uppercase tracking-wider">
                Last Updated: June 2026
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-a:text-brand-gold">
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              At Milestone Energym, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our facility, website, and app.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">1. Information Collection</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              We collect information to provide better services to our members. The types of personal information we collect include:
            </p>
            <ul className="list-disc pl-6 text-white/60 space-y-2 mb-8">
              <li><strong>Personal Identification Details:</strong> Name, age, gender, contact number, email address, and physical address.</li>
              <li><strong>Health and Fitness Data:</strong> Current fitness levels, medical history, weight, height, and fitness goals to tailor your workout plans.</li>
              <li><strong>Payment Information:</strong> Credit card details, UPI IDs, or banking information for processing memberships.</li>
              <li><strong>Facility Usage Data:</strong> Gym check-in times and class attendance.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">2. How We Use Your Information</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              We use the collected information for various purposes, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-white/60 space-y-2 mb-8">
              <li>Providing and managing your gym membership and services.</li>
              <li>Communicating with you regarding schedule changes, updates, and promotional offers.</li>
              <li>Personalizing your fitness and diet plans for better results.</li>
              <li>Ensuring safety and security within the gym premises.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">3. Data Security</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely and accessed only by authorized personnel for the purpose of managing your fitness journey. We do not sell or trade your personal information to third parties.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">4. Contact Us</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, the practices of our gym, or your dealings with us, please contact us at <a href="mailto:contact@milestoneenergym.com">contact@milestoneenergym.com</a> or visit us at our location in Barmer, Rajasthan.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
