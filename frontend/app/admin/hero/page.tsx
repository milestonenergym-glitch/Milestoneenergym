'use client'

import { useState, useEffect } from 'react'
import { getHeroBanners, createHeroBanner, toggleHeroBannerActive, deleteHeroBanner } from '@/app/actions/hero'
import { Plus, Trash2, Image as ImageIcon, Power } from 'lucide-react'
import { toast } from 'sonner'

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    const data = await getHeroBanners()
    setBanners(data)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      imageUrl: formData.get('imageUrl') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
    }

    const res = await createHeroBanner(data)
    if (res.success) {
      toast.success('Hero Banner created')
      setIsModalOpen(false)
      fetchBanners()
    } else {
      toast.error(res.error || 'Failed to create banner')
    }
    setIsSubmitting(false)
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleHeroBannerActive(id, !currentStatus)
    if (res.success) {
      toast.success('Banner status updated')
      fetchBanners()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    const res = await deleteHeroBanner(id)
    if (res.success) {
      toast.success('Banner deleted')
      fetchBanners()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Banners</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage homepage slider background images and text.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Banners Found</h3>
              <p className="text-zinc-400 text-sm max-w-md">Add a banner image and headline to show on the homepage.</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col relative group">
                <div 
                  className={`h-48 bg-cover bg-center ${!banner.isActive && 'grayscale opacity-50'}`}
                  style={{ backgroundImage: `url('${banner.imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                
                <div className="p-5 relative">
                  <h3 className="text-xl font-bold text-white mb-1">{banner.title || 'No Title'}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{banner.subtitle || 'No Subtitle'}</p>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <button 
                      onClick={() => handleToggle(banner.id, banner.isActive)}
                      className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${banner.isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      <Power className="w-4 h-4" /> {banner.isActive ? 'Active' : 'Hidden'}
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <h2 className="text-xl font-bold text-white">Add Hero Banner</h2>
              <p className="text-zinc-400 text-sm mt-1">Provide image URL and headline.</p>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Background Image URL</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  placeholder="e.g., /class-crossfit.png or https://..." 
                  required 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" 
                />
                <p className="text-xs text-zinc-500 mt-1">Default options: /about-hero.png, /class-strength.png, /class-cardio.png, /class-crossfit.png</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Headline (Title)</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g., Train Hard." 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Subtitle (Optional)</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  placeholder="e.g., Join our elite community" 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" 
                />
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
                  {isSubmitting ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
