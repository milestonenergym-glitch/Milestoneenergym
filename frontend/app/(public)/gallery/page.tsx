"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import { getGalleryImages } from '@/app/actions/gallery'

export default function GalleryPage() {
  const [filter, setFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [dbImages, setDbImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getGalleryImages()
      setDbImages(data.filter((img: any) => img.isActive))
      setLoading(false)
    }
    load()
  }, [])

  const filteredImages = filter === 'All' 
    ? dbImages 
    : dbImages.filter(img => img.category.toLowerCase() === filter.toLowerCase())

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Our <span className="text-brand-gold">Gallery</span>
          </h1>
          <p className="text-lg text-white/60">
            Take a virtual tour of Milestone Energym. Experience our premium facilities, state-of-the-art equipment, and vibrant community.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="container-custom mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { id: 'All', label: 'All Photos' },
            { id: 'Facility', label: 'Facility' },
            { id: 'Equipment', label: 'Equipment' },
            { id: 'Classes', label: 'Classes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-brand-gold text-black shadow-[0_0_15px_rgba(235,178,54,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="container-custom">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"></div>
          </div>
        ) : dbImages.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3">Check back soon!</h3>
            <p className="text-white/60">We are currently updating our gallery with fresh photos of our premium facility.</p>
          </div>
        ) : (
          <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={image.id}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer break-inside-avoid border border-white/10"
                  onClick={() => setSelectedImage(image.imageUrl)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title || image.category}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
                    <ZoomIn className="w-10 h-10 text-brand-gold mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="text-white font-semibold uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      View Full Size
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:text-brand-gold transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              <Image
                src={selectedImage}
                alt="Fullscreen view"
                fill
                className="object-contain"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
