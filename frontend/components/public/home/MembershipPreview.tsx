'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, ArrowRight, Tag } from 'lucide-react'
import { getPlans } from '@/app/actions/plans'

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    duration: '1 Month',
    price: 1500,
    originalPrice: null,
    popular: false,
    color: '#0F52BA',
    features: ['All Equipment Access', 'Cardio Zone', 'Locker Room', 'Parking', 'Basic Diet Guidance'],
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    duration: '3 Months',
    price: 3999,
    originalPrice: 4500,
    popular: false,
    color: '#0F52BA',
    features: ['Everything in Monthly', 'Group Classes', 'Diet Consultation', '1 PT Session/month', 'Progress Tracking'],
  },
  {
    id: 'half-yearly',
    name: 'Half Yearly',
    duration: '6 Months',
    price: 6999,
    originalPrice: 9000,
    popular: true,
    color: '#D4AF37',
    features: ['Everything in Quarterly', '2 PT Sessions/month', 'Nutrition Plan', 'Body Composition Analysis', 'Priority Support'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    duration: '12 Months',
    price: 11999,
    originalPrice: 18000,
    popular: false,
    color: '#0F52BA',
    features: ['Everything in Half Yearly', 'Unlimited PT Sessions', 'Custom Diet Plan', 'Transformation Program', 'VIP Member Badge'],
  },
]

export default function MembershipPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [dbPlans, setDbPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getPlans()
      setDbPlans(data.filter((p: any) => p.isActive))
      setLoading(false)
    }
    load()
  }, [])

  const displayPlans = dbPlans.length > 0 ? dbPlans.slice(0, 4).map((plan, idx) => {
    const staticPlan = plans[idx % plans.length]
    let featuresArray = staticPlan.features
    if (plan.features) {
      featuresArray = plan.features.split('\\n').map((f: string) => f.trim()).filter(Boolean)
    }
    
    return {
      id: plan.id,
      name: plan.name,
      duration: `${Math.round(plan.durationInDays / 30)} Month${Math.round(plan.durationInDays / 30) > 1 ? 's' : ''}`,
      price: plan.price,
      originalPrice: plan.originalPrice || staticPlan.originalPrice,
      popular: plan.popular !== undefined ? plan.popular : staticPlan.popular,
      color: plan.colorTheme && plan.colorTheme !== 'default' ? plan.colorTheme : staticPlan.color,
      features: featuresArray
    }
  }) : plans

  return (
    <section
      className="section-padding bg-[#080808] relative overflow-hidden"
      id="membership-preview"
      aria-labelledby="membership-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(15,82,186,0.08),transparent_70%)]" />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-label mb-4 inline-block"
          >
            Membership Plans
          </motion.span>

          <motion.h2
            id="membership-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Choose Your{' '}
            <span className="text-gradient">Power Plan</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            Flexible plans designed to fit your lifestyle and fitness goals. No hidden fees.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {loading ? (
             <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20 text-white/50 animate-pulse">Loading Power Plans...</div>
          ) : displayPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-visible rounded-2xl p-6 flex flex-col transition-all duration-400 cursor-default ${
                plan.popular
                  ? 'border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#D4AF37]/10 to-transparent'
                  : 'glass border border-white/10'
              }`}
              style={{
                boxShadow: hoveredPlan === plan.id
                  ? `0 20px 60px rgba(${plan.popular ? '212,175,55' : '15,82,186'}, 0.25)`
                  : '0 4px 24px rgba(0,0,0,0.4)',
                transform: hoveredPlan === plan.id ? 'translateY(-4px)' : 'none',
              }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              id={`plan-${plan.id}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#E7BE3A] to-[#D4AF37] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-5">
                <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{plan.duration}</div>
                <div className="text-white font-bold text-xl">{plan.name}</div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-white/40 text-sm font-medium">₹</span>
                  <span
                    className="text-4xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, #fff, ${plan.color})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {plan.price.toLocaleString('en-IN')}
                  </span>
                </div>
                {plan.originalPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/30 text-sm line-through">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-green-400 text-xs font-semibold">
                      Save ₹{(plan.originalPrice - plan.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="text-white/30 text-xs mt-1">+ GST</div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                    <span className="text-white/70 text-sm leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/membership?plan=${plan.id}`}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all z-10 relative ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#E7BE3A] to-[#D4AF37] text-black hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-gradient-to-r from-[#0F52BA] to-[#0C44A0] text-white hover:opacity-90'
                }`}
                id={`plan-cta-${plan.id}`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/membership"
            className="flex items-center gap-2 text-brand-blue-300 hover:text-white font-medium text-sm transition-colors"
            id="view-all-plans"
          >
            View All Plans & Compare
            <ArrowRight className="w-4 h-4" />
          </Link>

          <span className="text-white/20 hidden sm:block">•</span>

          <div className="flex items-center gap-2 text-brand-gold text-sm font-medium">
            <Tag className="w-4 h-4" />
            Have a coupon code? Apply at checkout
          </div>
        </motion.div>
      </div>
    </section>
  )
}
