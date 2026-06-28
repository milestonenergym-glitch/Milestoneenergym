'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getGalleryImages, createGalleryImage, deleteGalleryImage, toggleGalleryImageActive } from '@/app/actions/gallery'
import { Plus, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

const CATEGORIES = ['Facility', 'Equipment', 'Classes']

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    const data = await getGalleryImages()
    setImages(data)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      title: formData.get('title') as string || undefined,
    }

    const res = await createGalleryImage(data)
    if (res.success) {
      toast.success('Image added to gallery')
      setIsModalOpen(false)
      fetchImages()
    } else {
      toast.error(res.error || 'Failed to add image')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    const res = await deleteGalleryImage(id)
    if (res.success) {
      toast.success('Image deleted')
      fetchImages()
    } else {
      toast.error(res.error || 'Failed to delete image')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await toggleGalleryImageActive(id, !currentStatus)
    if (res.success) {
      toast.success(currentStatus ? 'Image hidden' : 'Image published')
      fetchImages()
    } else {
      toast.error(res.error || 'Failed to update status')
    }
  }

  const filteredImages = activeTab === 'All' 
    ? images 
    : images.filter(img => img.category === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Upload and categorize images for the public gallery.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('All')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'All' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All Images
        </button>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === category ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Images Found</h3>
              <p className="text-zinc-400 text-sm max-w-md">Add images to showcase your gym facilities, equipment, and classes.</p>
            </div>
          ) : (
            filteredImages.map((image) => (
              <motion.div 
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                  <Image 
                    src={image.imageUrl} 
                    alt={image.title || image.category}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!image.isActive ? 'grayscale opacity-50' : ''}`}
                  />
                  {!image.isActive && (
                    <div className="absolute top-2 left-2 bg-zinc-900/80 text-zinc-400 text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/10 uppercase font-semibold">
                    {image.category}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  {image.title && <h3 className="text-white font-medium text-sm mb-1 truncate">{image.title}</h3>}
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(image.id, image.isActive)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      {image.isActive ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="w-10 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Add New Image</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Image URL *</label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category *</label>
                <select
                  name="category"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title (Optional)</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Cardio Zone Area"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Saving...</>
                  ) : (
                    'Add Image'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
