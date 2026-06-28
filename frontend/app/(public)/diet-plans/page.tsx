"use client"

import { motion } from 'framer-motion'

export default function DietPlansPage() {
  return (
    <div className="min-h-screen pt-[120px] pb-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            Diet Plans
          </h1>
          <p className="text-lg text-white/60 mb-12">
            This page is currently under development. Stay tuned for updates!
          </p>
          
          <div className="glass p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-20 h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-6"></div>
             <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
             <p className="text-white/50 text-center max-w-md">
               We are working hard to bring you the best experience. The Diet Plans page will be available shortly.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
