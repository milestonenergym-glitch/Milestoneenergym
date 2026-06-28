'use client'

import { useState, useEffect } from 'react'
import { getTestimonials, createTestimonial, toggleTestimonialActive, deleteTestimonial } from '@/app/actions/testimonials'
import { Plus, Trash2, MessageSquare, Power, Star } from 'lucide-react'
import { toast } from 'sonner'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    const data = await getTestimonials()
    setTestimonials(data)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      content: formData.get('content') as string,
      rating: Number(formData.get('rating')),
      imageUrl: formData.get('imageUrl') as string || undefined
    }

    const res = await createTestimonial(data)
    if (res.success) {
      toast.success('Testimonial created')
      setIsModalOpen(false)
      fetchTestimonials()
    } else {
      toast.error(res.error || 'Failed to create testimonial')
    }
    setIsSubmitting(false)
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleTestimonialActive(id, !currentStatus)
    if (res.success) {
      toast.success('Testimonial status updated')
      fetchTestimonials()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    const res = await deleteTestimonial(id)
    if (res.success) {
      toast.success('Testimonial deleted')
      fetchTestimonials()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage member reviews shown on the homepage.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Testimonials Found</h3>
              <p className="text-zinc-400 text-sm max-w-md">Add member feedback to showcase your gym's impact.</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className={`bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col relative ${!testimonial.isActive && 'opacity-50'}`}>
                <div className="flex items-center gap-1 mb-4 text-brand-gold">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-zinc-300 italic mb-6 flex-1 text-sm line-clamp-4">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-3 border-t border-white/10 pt-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-brand-gold font-bold shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                    <p className="text-zinc-500 text-xs">{testimonial.role || 'Member'}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <button 
                    onClick={() => handleToggle(testimonial.id, testimonial.isActive)}
                    className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${testimonial.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    <Power className="w-3 h-3" /> {testimonial.isActive ? 'Active' : 'Hidden'}
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add Testimonial</h2>
              <p className="text-zinc-400 text-sm mt-1">Share member success stories.</p>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Member Name</label>
                  <input type="text" name="name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Role (Optional)</label>
                  <input type="text" name="role" placeholder="e.g., Member for 2 years" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                <select name="rating" required defaultValue="5" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Review Content</label>
                <textarea 
                  name="content" 
                  required 
                  rows={4}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold resize-none" 
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium hover:bg-white/5 transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-gold text-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
