"use client"

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PolicyPage() {
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
                Last Updated: October 1, 2023
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-a:text-brand-gold">
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              At Milestone Energym, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our facility, website, and app.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">1. Introduction</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">2. Information Collection</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            
            <ul className="list-disc pl-6 text-white/60 space-y-2 mb-8">
              <li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur</li>
              <li>Neque porro quisquam est, qui dolorem ipsum quia dolor</li>
              <li>Ut enim ad minima veniam, quis nostrum exercitationem</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">3. Contact Us</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              If you have any questions about this policy, please contact us at <a href="mailto:legal@milestoneenergym.com">legal@milestoneenergym.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
