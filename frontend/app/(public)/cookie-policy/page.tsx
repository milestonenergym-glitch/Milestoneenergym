"use client"

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function CookiePolicyPage() {
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
                Cookie Policy
              </h1>
              <p className="text-brand-gold mt-2 text-sm font-semibold uppercase tracking-wider">
                Last Updated: June 2026
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:uppercase prose-a:text-brand-gold">
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              This Cookie Policy explains how Milestone Energym uses cookies and similar tracking technologies on our website. It explains what these technologies are, why we use them, and your right to control our use of them.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">1. What are Cookies?</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">2. Why We Use Cookies</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              We use first-party and third-party cookies for several reasons:
            </p>
            <ul className="list-disc pl-6 text-white/60 space-y-2 mb-8">
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features.</li>
              <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
              <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or to help us customize our website for you.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">3. Local Storage</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              In addition to cookies, we use local storage technologies. For example, we use local storage to remember whether you have seen our Grand Opening promotional popup so that we do not show it to you multiple times and interrupt your browsing experience.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">4. How to Control Cookies</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
            
            <h2 className="text-2xl font-bold mt-10 mb-4 text-brand-blue-400">5. Contact Us</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@milestoneenergym.com">privacy@milestoneenergym.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
