"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Flame, Utensils } from 'lucide-react'
import Link from 'next/link'

export default function CaloriesCalculatorPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [activity, setActivity] = useState<string>('1.2')
  
  const [tdee, setTdee] = useState<number | null>(null)

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault()
    if (age && height && weight) {
      const a = parseFloat(age)
      const h = parseFloat(height)
      const w = parseFloat(weight)
      
      // Mifflin-St Jeor Equation
      let bmr = 0
      if (gender === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161
      }
      
      const multiplier = parseFloat(activity)
      const totalCalories = bmr * multiplier
      
      setTdee(Math.round(totalCalories))
    }
  }

  const resetForm = () => {
    setAge('')
    setHeight('')
    setWeight('')
    setTdee(null)
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
            <Flame className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight uppercase">
            Daily <span className="text-brand-blue-400">Calories</span> Calculator
          </h1>
          <p className="text-lg text-white/60">
            Calculate your Total Daily Energy Expenditure (TDEE). This is the number of calories your body burns per day based on your activity level.
          </p>
        </motion.div>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass p-8 md:p-10 rounded-3xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-8">Enter your details</h2>
            
            <form onSubmit={calculateCalories} className="space-y-6">
              
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 rounded-xl border transition-all ${
                      gender === 'male' 
                        ? 'bg-brand-gold/20 border-brand-gold text-brand-gold' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 rounded-xl border transition-all ${
                      gender === 'female' 
                        ? 'bg-brand-gold/20 border-brand-gold text-brand-gold' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 25"
                    required min="10" max="100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    required min="100" max="250"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    required min="30" max="300"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">Activity Level</label>
                <div className="space-y-3">
                  {[
                    { val: '1.2', label: 'Sedentary', desc: 'Little or no exercise, desk job' },
                    { val: '1.375', label: 'Lightly Active', desc: 'Light exercise/sports 1-3 days/week' },
                    { val: '1.55', label: 'Moderately Active', desc: 'Moderate exercise/sports 3-5 days/week' },
                    { val: '1.725', label: 'Very Active', desc: 'Hard exercise/sports 6-7 days a week' },
                    { val: '1.9', label: 'Extremely Active', desc: 'Very hard exercise/physical job' },
                  ].map(lvl => (
                    <label key={lvl.val} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      activity === lvl.val 
                        ? 'bg-brand-gold/10 border-brand-gold' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                      <div className="mt-0.5">
                        <input
                          type="radio"
                          name="activity"
                          value={lvl.val}
                          checked={activity === lvl.val}
                          onChange={(e) => setActivity(e.target.value)}
                          className="w-4 h-4 text-brand-gold bg-black border-white/20 focus:ring-brand-gold focus:ring-offset-black"
                        />
                      </div>
                      <div>
                        <div className={`font-semibold mb-0.5 ${activity === lvl.val ? 'text-brand-gold' : 'text-white'}`}>{lvl.label}</div>
                        <div className="text-sm text-white/50">{lvl.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 btn-primary py-4">
                  Calculate TDEE
                </button>
                {tdee && (
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
            className="lg:col-span-5"
          >
            {tdee ? (
              <div className="sticky top-[120px] glass p-8 rounded-3xl border border-brand-gold/30 flex flex-col justify-center text-center relative overflow-hidden bg-gradient-to-b from-brand-gold/5 to-transparent">
                <Utensils className="w-12 h-12 text-brand-gold mx-auto mb-4 opacity-50" />
                
                <h3 className="text-lg text-white/70 uppercase tracking-widest font-semibold mb-2">Maintenance Calories</h3>
                <p className="text-sm text-white/50 mb-6">The calories you need to maintain your current weight.</p>
                
                <div className="flex items-baseline justify-center gap-2 mb-10 text-brand-gold">
                  <span className="text-6xl md:text-7xl font-bold font-heading tracking-tighter">{tdee.toLocaleString()}</span>
                  <span className="text-xl font-semibold">kcal</span>
                </div>

                <div className="space-y-4 text-left mb-10">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-brand-blue-400/30 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-blue-400 group-hover:text-brand-blue-300">Mild Weight Loss</div>
                      <div className="text-xs text-white/50">0.25 kg/week (-250 kcal)</div>
                    </div>
                    <div className="font-bold">{(tdee - 250).toLocaleString()}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-brand-blue-500/30 transition-colors">
                    <div>
                      <div className="font-semibold text-brand-blue-500 group-hover:text-brand-blue-400">Weight Loss</div>
                      <div className="text-xs text-white/50">0.5 kg/week (-500 kcal)</div>
                    </div>
                    <div className="font-bold">{(tdee - 500).toLocaleString()}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-red-400/30 transition-colors">
                    <div>
                      <div className="font-semibold text-red-400 group-hover:text-red-300">Weight Gain</div>
                      <div className="text-xs text-white/50">0.25 kg/week (+250 kcal)</div>
                    </div>
                    <div className="font-bold">{(tdee + 250).toLocaleString()}</div>
                  </div>
                </div>

                <Link href="/membership" className="btn-primary w-full group">
                  Get a Custom Diet Plan
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="h-full glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center opacity-60 min-h-[400px]">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-bold mb-3">Your TDEE Result</h3>
                <p className="text-white/60 max-w-xs">
                  Fill out the form with your details to calculate your daily caloric needs for maintenance, cutting, or bulking.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
