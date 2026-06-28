'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPlans, createPlan, deletePlan, updatePlan } from '@/app/actions/plans'
import { Plus, Tag, Clock, IndianRupee, Trash2, CheckCircle2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    const data = await getPlans()
    setPlans(data)
    setLoading(false)
  }

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined,
      durationInDays: Number(formData.get('durationInDays')),
      features: formData.get('features') as string,
      popular: formData.get('popular') === 'on',
      colorTheme: formData.get('colorTheme') as string || 'default',
    }

    let res;
    if (editingPlan) {
      res = await updatePlan(editingPlan.id, data)
    } else {
      res = await createPlan(data)
    }

    if (res.success) {
      toast.success(editingPlan ? 'Plan updated successfully' : 'Plan created successfully')
      setIsModalOpen(false)
      fetchPlans()
    } else {
      toast.error(res.error || 'Failed to save plan')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    const res = await deletePlan(id)
    if (res.success) {
      toast.success('Plan deleted')
      fetchPlans()
    } else {
      toast.error(res.error || 'Failed to delete plan')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
          <p className="text-zinc-400 text-sm mt-1">Create and manage your gym's pricing packages.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Tag className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Plans Yet</h3>
              <p className="text-zinc-400 text-sm max-w-md">You haven't created any membership plans. Create a plan to start adding members.</p>
            </div>
          ) : (
            plans.map((plan) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {plan.popular && <span className="bg-brand-gold/20 text-brand-gold text-xs px-2 py-0.5 rounded uppercase font-bold">Popular</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEdit(plan)} className="text-zinc-500 hover:text-white transition-colors p-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold text-brand-gold">₹{plan.price.toLocaleString('en-IN')}</span>
                  {plan.originalPrice && (
                    <span className="text-zinc-500 text-sm line-through ml-1 mb-1">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  <span className="text-zinc-500 text-sm mb-1 ml-1">/ {plan.durationInDays} days</span>
                </div>

                {plan.description && (
                  <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                )}

                {plan.features && (
                  <ul className="text-zinc-400 text-sm mb-6 flex-1 space-y-2">
                    {plan.features.split('\\n').map((feature: string, idx: number) => feature.trim() ? (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ) : null)}
                  </ul>
                )}

                <div className="space-y-3 mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Active Package
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Clock className="w-4 h-4 text-brand-gold" /> Valid for {plan.durationInDays} Days
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Plan Name</label>
                <input type="text" name="name" defaultValue={editingPlan?.name} required placeholder="e.g., 3 Months Gold" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Price (₹)</label>
                  <input type="number" name="price" defaultValue={editingPlan?.price} required placeholder="5000" min="0" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (Days)</label>
                  <input type="number" name="durationInDays" defaultValue={editingPlan?.durationInDays} required placeholder="90" min="1" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Original Price (₹) (Optional)</label>
                  <input type="number" name="originalPrice" defaultValue={editingPlan?.originalPrice} placeholder="e.g., 6000" min="0" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Color Theme</label>
                  <select name="colorTheme" defaultValue={editingPlan?.colorTheme || 'default'} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold">
                    <option value="default">Default (White/Blue)</option>
                    <option value="#D4AF37">Gold</option>
                    <option value="#0F52BA">Sapphire Blue</option>
                    <option value="#50C878">Emerald Green</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Benefits/Features (1 per line)</label>
                <textarea name="features" defaultValue={editingPlan?.features} rows={5} placeholder="Cardio Zone\nWeight Training\nDiet Consultation" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description (Optional)</label>
                <textarea name="description" defaultValue={editingPlan?.description} rows={2} placeholder="Brief sub-text for the plan." className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold resize-none" />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" name="popular" id="popular" defaultChecked={editingPlan?.popular} className="w-4 h-4 rounded border-white/10 bg-zinc-950 text-brand-gold focus:ring-brand-gold focus:ring-offset-zinc-900" />
                <label htmlFor="popular" className="text-sm font-medium text-zinc-400">Mark as "Most Popular"</label>
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-zinc-900 py-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
