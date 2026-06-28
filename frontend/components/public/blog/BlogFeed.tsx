'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'

export default function BlogFeed({ blogPosts }: { blogPosts: any[] }) {
  return (
    <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
      
      {/* Main Blog Feed */}
      <div className="lg:col-span-8 space-y-10">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-white/60">Check back later for fitness insights and news.</p>
          </div>
        ) : (
          blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-3xl border border-white/10 overflow-hidden group hover:border-brand-gold/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 relative min-h-[250px] md:min-h-full overflow-hidden bg-black/50">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                </div>
                
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 group-hover:text-brand-gold transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-white/60 mb-6 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>{post.author?.name || 'Milestone Team'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-brand-gold font-semibold uppercase tracking-wider text-sm hover:text-brand-gold-300 transition-colors w-fit">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))
        )}

        <div className="flex justify-center pt-8">
          <button className="btn-outline">Load More Articles</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4 font-heading uppercase">Search</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold mb-6 font-heading uppercase">Categories</h3>
          <ul className="space-y-3">
            {[
              { name: 'Training', count: 12 },
              { name: 'Nutrition', count: 8 },
              { name: 'Recovery', count: 5 },
              { name: 'Mindset', count: 3 },
              { name: 'Gym News', count: 4 },
            ].map(cat => (
              <li key={cat.name}>
                <Link href="#" className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-white/70 group-hover:text-brand-gold transition-colors">
                    <Tag className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/50 group-hover:bg-brand-gold/20 group-hover:text-brand-gold transition-colors">
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-8 rounded-3xl border border-brand-gold/30 bg-gradient-to-b from-brand-gold/5 to-transparent relative overflow-hidden"
        >
          <h3 className="text-xl font-bold mb-2 font-heading uppercase text-brand-gold">Newsletter</h3>
          <p className="text-white/60 text-sm mb-6">Subscribe to get the latest fitness tips and exclusive gym offers directly to your inbox.</p>
          
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
            />
            <button type="submit" className="w-full bg-brand-gold text-black font-bold uppercase tracking-wider text-sm py-3 rounded-xl hover:bg-brand-gold-300 transition-colors">
              Subscribe
            </button>
          </form>
        </motion.div>
        
      </div>
    </div>
  )
}
