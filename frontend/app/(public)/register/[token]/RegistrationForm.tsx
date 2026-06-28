'use client'

import { useState } from 'react'
import { Activity, Calendar, ArrowRight, User } from 'lucide-react'
import { createMember } from '@/app/actions/members'
import { markLinkAsUsed } from '@/app/actions/registration-links'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RegistrationForm({ token, plans }: { token: string, plans: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const planId = formData.get('planId') as string
    const selectedPlan = plans.find(p => p.id === planId)
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      dateOfBirth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string) : undefined,
      bloodGroup: formData.get('bloodGroup'),
      address: formData.get('address'),
      emergencyContact: formData.get('emergencyContact'),
      emergencyContactPhone: formData.get('emergencyContactPhone'),
      planId,
      durationInDays: selectedPlan?.durationInDays || 0,
      amountPaid: selectedPlan?.price || 0,
    }

    const res = await createMember(data)
    if (res.success) {
      await markLinkAsUsed(token)
      toast.success('Registration completed successfully!')
      router.refresh() // This will cause the page to reload and show the "You are already Registered" state
    } else {
      toast.error(res.error || 'Failed to complete registration')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
      {/* Personal Details */}
      <div>
        <h3 className="text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
          <User className="w-4 h-4" /> Personal Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name *</label>
            <input type="text" name="name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Phone Number *</label>
            <input type="tel" name="phone" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
            <input type="email" name="email" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Date of Birth *</label>
            <input type="date" name="dateOfBirth" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Gender *</label>
            <select name="gender" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none">
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Blood Group</label>
            <input type="text" name="bloodGroup" placeholder="e.g. O+" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Address & Emergency */}
      <div>
        <h3 className="text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
          <Activity className="w-4 h-4" /> Address & Emergency
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Address *</label>
            <textarea name="address" required rows={2} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="Enter your full residential address"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Emergency Contact Name *</label>
            <input type="text" name="emergencyContact" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Emergency Contact Phone *</label>
            <input type="tel" name="emergencyContactPhone" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* Membership Selection */}
      <div>
        <h3 className="text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
          <Calendar className="w-4 h-4" /> Membership Plan
        </h3>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-400 mb-1">Select your Package *</label>
          <div className="grid sm:grid-cols-2 gap-4">
            {plans.map(p => (
              <label key={p.id} className="relative flex cursor-pointer rounded-xl bg-zinc-950 border border-white/10 p-4 hover:border-brand-gold transition-colors has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/5">
                <input type="radio" name="planId" value={p.id} required className="peer sr-only" />
                <div className="flex w-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{p.name}</span>
                    <span className="font-bold text-brand-gold">₹{p.price}</span>
                  </div>
                  <span className="text-sm text-zinc-500 mt-1">{p.durationInDays} days</span>
                </div>
                <div className="absolute right-4 top-4 hidden w-4 h-4 rounded-full border-2 border-brand-gold bg-brand-gold peer-checked:block">
                  <div className="w-full h-full bg-brand-gold border-2 border-zinc-900 rounded-full"></div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Submit */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-4 px-6 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? 'Submitting Details...' : 'Complete Registration'}
          {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </button>
        <p className="text-xs text-zinc-500 text-center mt-4">
          By completing this registration, you agree to our Terms & Conditions and safety protocols.
        </p>
      </div>
    </form>
  )
}
