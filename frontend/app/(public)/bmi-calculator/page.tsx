"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'

export default function BmiCalculatorPage() {
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState<string>('')

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault()
    if (height && weight) {
      const h = parseFloat(height) / 100 // cm to meters
      const w = parseFloat(weight)
      const bmiValue = w / (h * h)
      setBmi(parseFloat(bmiValue.toFixed(1)))

      if (bmiValue < 18.5) setCategory('Underweight')
      else if (bmiValue >= 18.5 && bmiValue <= 24.9) setCategory('Normal Weight')
      else if (bmiValue >= 25 && bmiValue <= 29.9) setCategory('Overweight')
      else setCategory('Obese')
    }
  }

  const resetForm = () => {
    setHeight('')
    setWeight('')
    setBmi(null)
    setCategory('')
  }

  // Get color based on category
  const getResultColor = () => {
    if (category === 'Underweight') return 'text-blue-400'
    if (category === 'Normal Weight') return 'text-green-500'
    if (category === 'Overweight') return 'text-yellow-500'
    if (category === 'Obese') return 'text-red-500'
    return 'text-white'
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight uppercase">
            BMI <span className="text-brand-blue-400">Calculator</span>
          </h1>
          <p className="text-lg text-white/60">
            Body Mass Index (BMI) is a simple calculation using your height and weight. Find out if you are at a healthy weight to establish your fitness goals.
          </p>
        </motion.div>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass p-8 md:p-10 rounded-3xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-8">Enter your details</h2>
            
            <form onSubmit={calculateBMI} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  required
                  min="50"
                  max="300"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  required
                  min="20"
                  max="500"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 btn-primary py-4">
                  Calculate BMI
                </button>
                {bmi && (
                  <button type="button" onClick={resetForm} className="btn-outline px-8">
                    Reset
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Results Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {bmi ? (
              <div className="h-full glass p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col justify-center text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-current to-transparent ${getResultColor()} opacity-50`}></div>
                
                <h3 className="text-xl text-white/60 uppercase tracking-widest font-semibold mb-4">Your Result</h3>
                
                <div className="text-7xl md:text-8xl font-bold font-heading mb-6 tracking-tighter">
                  {bmi}
                </div>
                
                <div className={`text-2xl font-bold mb-8 uppercase tracking-wider ${getResultColor()}`}>
                  {category}
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 text-left">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">
                      {category === 'Normal Weight' 
                        ? 'Great job! You are in a healthy weight range. Maintain your fitness with our regular programs to stay in shape.'
                        : category === 'Underweight'
                        ? 'You are below the healthy weight range. Consider joining our Strength & Conditioning programs to build healthy muscle mass.'
                        : 'You are above the healthy weight range. Our cardio and customized personal training plans can help you reach your goals safely.'}
                    </p>
                  </div>
                </div>

                <Link href="/membership" className="btn-outline w-full group">
                  View Recommended Plans
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="h-full glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                  <span className="text-3xl">?</span>
                </div>
                <h3 className="text-xl font-bold mb-3">No Result Yet</h3>
                <p className="text-white/60 max-w-xs">
                  Enter your height and weight on the left and click calculate to see your BMI score.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* BMI Chart */}
      <div className="container-custom mt-24">
        <div className="max-w-5xl mx-auto glass rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/10">
            <h3 className="text-xl font-bold">BMI Categories Reference</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            <div className="p-6 text-center hover:bg-white/5 transition-colors">
              <div className="text-blue-400 font-bold mb-1">Under 18.5</div>
              <div className="text-sm text-white/60">Underweight</div>
            </div>
            <div className="p-6 text-center hover:bg-white/5 transition-colors">
              <div className="text-green-500 font-bold mb-1">18.5 - 24.9</div>
              <div className="text-sm text-white/60">Normal Weight</div>
            </div>
            <div className="p-6 text-center hover:bg-white/5 transition-colors">
              <div className="text-yellow-500 font-bold mb-1">25.0 - 29.9</div>
              <div className="text-sm text-white/60">Overweight</div>
            </div>
            <div className="p-6 text-center hover:bg-white/5 transition-colors">
              <div className="text-red-500 font-bold mb-1">30.0 and Above</div>
              <div className="text-sm text-white/60">Obese</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
