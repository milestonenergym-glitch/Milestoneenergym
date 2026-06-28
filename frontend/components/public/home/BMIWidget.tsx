'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calculator, Info } from 'lucide-react'

type BMICategory = {
  label: string
  range: string
  color: string
  bg: string
  advice: string
}

const bmiCategories: BMICategory[] = [
  { label: 'Underweight', range: '< 18.5', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', advice: 'Focus on strength training and a caloric surplus diet plan.' },
  { label: 'Normal', range: '18.5 – 24.9', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', advice: 'Maintain your fitness with a balanced workout and diet routine.' },
  { label: 'Overweight', range: '25 – 29.9', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', advice: 'Cardio + strength training with a caloric deficit diet can help.' },
  { label: 'Obese', range: '≥ 30', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', advice: 'Consult our certified trainers for a safe weight loss program.' },
]

export default function BMIWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBMI] = useState<number | null>(null)
  const [category, setCategory] = useState<BMICategory | null>(null)

  const calculateBMI = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return
    const result = w / (h * h)
    setBMI(Math.round(result * 10) / 10)
    if (result < 18.5) setCategory(bmiCategories[0])
    else if (result < 25) setCategory(bmiCategories[1])
    else if (result < 30) setCategory(bmiCategories[2])
    else setCategory(bmiCategories[3])
  }

  const reset = () => { setHeight(''); setWeight(''); setBMI(null); setCategory(null) }

  return (
    <section
      className="section-padding bg-[#080808] relative"
      id="bmi-calculator"
      aria-labelledby="bmi-heading"
    >
      <div className="container-custom" ref={ref}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="section-label mb-4 inline-block">
              Free Tool
            </motion.span>
            <motion.h2
              id="bmi-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              BMI <span className="text-gradient">Calculator</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/50"
            >
              Calculate your Body Mass Index and get a personalized fitness recommendation.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Input Side */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-brand-blue-300" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Enter Your Details</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-white/50 text-sm font-medium mb-2 block" htmlFor="bmi-height">
                      Height (cm)
                    </label>
                    <input
                      id="bmi-height"
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      placeholder="e.g. 175"
                      className="input-premium"
                      min="100"
                      max="250"
                      aria-label="Height in centimeters"
                    />
                  </div>

                  <div>
                    <label className="text-white/50 text-sm font-medium mb-2 block" htmlFor="bmi-weight">
                      Weight (kg)
                    </label>
                    <input
                      id="bmi-weight"
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      className="input-premium"
                      min="30"
                      max="300"
                      aria-label="Weight in kilograms"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={calculateBMI}
                      className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                      id="calculate-bmi"
                    >
                      Calculate BMI
                    </button>
                    {bmi && (
                      <button
                        onClick={reset}
                        className="px-4 border border-white/10 text-white/40 hover:text-white rounded-xl transition-colors"
                        id="reset-bmi"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="mt-8">
                  <div className="h-2 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-500" />
                    <div className="flex-1 bg-green-500" />
                    <div className="flex-1 bg-yellow-500" />
                    <div className="flex-1 bg-red-500" />
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-1">
                    <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
                  </div>
                </div>
              </div>

              {/* Result Side */}
              <div className="p-8 flex flex-col items-center justify-center">
                {bmi && category ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center w-full"
                  >
                    {/* BMI Circle */}
                    <div
                      className="w-36 h-36 rounded-full flex flex-col items-center justify-center mx-auto mb-6 border-4"
                      style={{ borderColor: category.color, background: category.bg }}
                    >
                      <div className="text-4xl font-bold" style={{ color: category.color }}>{bmi}</div>
                      <div className="text-white/50 text-xs">BMI</div>
                    </div>

                    <div
                      className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                      style={{ background: category.bg, color: category.color }}
                    >
                      {category.label}
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed mb-6">{category.advice}</p>

                    <a
                      href="/#free-trial"
                      className="inline-block bg-gradient-to-r from-brand-blue to-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                      id="bmi-result-cta"
                    >
                      Get Free Fitness Assessment
                    </a>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Info className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm">Enter your height and weight to calculate your BMI</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
