"use client"

import { motion } from 'framer-motion'
import { Check, X, Info } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPlans } from '@/app/actions/plans'

const plans = [
  {
    name: 'Silver',
    price: '₹1,999',
    period: '/month',
    description: 'Perfect for beginners starting their fitness journey.',
    features: [
      'Access to gym equipment',
      'Locker room access',
      'Free fitness assessment',
      '1 Group class per week',
    ],
    notIncluded: [
      'Personal Training',
      'Diet Plan',
      'Massage Therapy',
    ],
    popular: false,
    color: 'from-gray-300 to-gray-500',
  },
  {
    name: 'Gold',
    price: '₹3,499',
    period: '/month',
    description: 'Our most popular plan for dedicated fitness enthusiasts.',
    features: [
      'Access to gym equipment',
      'Locker room & Sauna',
      'Free fitness assessment',
      'Unlimited Group classes',
      'Personalized Diet Plan',
      '1 PT Session / month',
    ],
    notIncluded: [
      'Massage Therapy',
    ],
    popular: true,
    color: 'from-brand-gold-300 to-brand-gold-600',
  },
  {
    name: 'Platinum',
    price: '₹5,999',
    period: '/month',
    description: 'The ultimate VIP experience for maximum results.',
    features: [
      '24/7 Access to all facilities',
      'Locker room, Sauna & Spa',
      'Unlimited Group classes',
      'Advanced Diet & Nutrition',
      '4 PT Sessions / month',
      'Weekly Massage Therapy',
      'Guest passes (2/month)',
    ],
    notIncluded: [],
    popular: false,
    color: 'from-brand-blue-300 to-brand-blue-600',
  },
]

const faqs = [
  {
    q: 'Can I freeze or pause my membership?',
    a: 'Yes, members on the Gold and Platinum plans can freeze their membership for up to 30 days per year without any additional fees. A 7-day notice is required.'
  },
  {
    q: 'Are there any joining fees or hidden charges?',
    a: 'No, we believe in complete transparency. The price you see is the price you pay. There are zero hidden registration or cancellation fees.'
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Absolutely! You can upgrade your plan at any time. The price difference will be prorated based on the remaining days in your billing cycle.'
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Yes, we offer a 3-day free trial pass for local residents so you can experience our facilities and classes before committing to a membership.'
  }
]

export default function MembershipPage() {
  const [dbPlans, setDbPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getPlans()
      setDbPlans(data)
      setLoading(false)
    }
    load()
  }, [])

  const displayPlans = dbPlans.length > 0 ? dbPlans.map((plan, idx) => {
    const staticPlan = plans[idx % plans.length]
    let featuresArray = staticPlan.features
    if (plan.features) {
      featuresArray = plan.features.split('\\n').map((f: string) => f.trim()).filter(Boolean)
    }

    return {
      id: plan.id,
      name: plan.name,
      price: `₹${plan.price}`,
      period: `/${plan.durationInDays} days`,
      description: plan.description || staticPlan.description,
      features: featuresArray,
      notIncluded: staticPlan.notIncluded,
      popular: plan.popular !== undefined ? plan.popular : staticPlan.popular,
      color: plan.colorTheme && plan.colorTheme !== 'default' ? plan.colorTheme : staticPlan.color
    }
  }) : plans

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
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Choose Your <span className="text-brand-gold">Journey</span>
          </h1>
          <p className="text-lg text-white/60">
            Simple, transparent pricing. No hidden fees or surprise charges. Unlock your full potential with a plan that fits your lifestyle.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
             <div className="col-span-3 text-center py-20 text-white/50 animate-pulse">Loading plans...</div>
          ) : displayPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-visible glass p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A]' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-[#E7BE3A] to-[#D4AF37] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] z-20">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${plan.color}`}>{plan.name}</h3>
              <p className="text-white/60 text-sm h-10 mb-6">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                <span className="text-white/50">{plan.period}</span>
              </div>
              
              <Link href="/contact" className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-[#E7BE3A] to-[#D4AF37] text-[#0A0A0A] hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}>
                Join Now
              </Link>

              <div className="mt-8 space-y-4">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
                
                {plan.notIncluded.map(feature => (
                  <div key={feature} className="flex items-start gap-3 opacity-50">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 uppercase">Frequently Asked <span className="text-brand-blue-400">Questions</span></h2>
            <p className="text-white/60">Everything you need to know about our memberships and billing.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-lg font-bold mb-2 flex items-center gap-3">
                  <Info className="w-5 h-5 text-brand-gold shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-white/60 pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
