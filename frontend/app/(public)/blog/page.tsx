"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'

// Dummy blog data
const blogPosts = [
  {
    id: 1,
    title: 'The Ultimate Guide to Pre-Workout Nutrition',
    excerpt: 'Discover what you should eat before hitting the gym to maximize your energy, endurance, and muscle growth.',
    category: 'Nutrition',
    author: 'Elena Rodriguez',
    date: 'Oct 15, 2023',
    image: '/class-strength.png', // Reusing generated images for thumbnails
    readTime: '5 min read'
  },
  {
    id: 2,
    title: '5 Yoga Poses for Post-Workout Recovery',
    excerpt: 'Speed up your muscle recovery and improve flexibility by incorporating these five essential yoga poses into your cool-down routine.',
    category: 'Recovery',
    author: 'Sarah Jenkins',
    date: 'Oct 02, 2023',
    image: '/class-yoga.png',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'Why HIIT is the Secret to Fat Loss',
    excerpt: 'High-Intensity Interval Training is proven to burn more calories in less time. Learn how to structure your HIIT workouts effectively.',
    category: 'Training',
    author: 'David Chen',
    date: 'Sep 28, 2023',
    image: '/class-crossfit.png',
    readTime: '6 min read'
  },
  {
    id: 4,
    title: 'Cardio vs. Weights: Which Should Come First?',
    excerpt: 'The age-old debate finally answered. Depending on your goals, the order of your workout matters more than you think.',
    category: 'Training',
    author: 'Marcus Thorne',
    date: 'Sep 15, 2023',
    image: '/class-cardio.png',
    readTime: '7 min read'
  }
]

export default function BlogPage() {
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
            Fitness <span className="text-brand-gold">Insights</span>
          </h1>
          <p className="text-lg text-white/60">
            Expert advice, training tips, nutritional guides, and the latest news from the Milestone Energym team.
          </p>
        </motion.div>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          
          {/* Main Blog Feed */}
          <div className="lg:col-span-8 space-y-10">
            {blogPosts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-3xl border border-white/10 overflow-hidden group hover:border-brand-gold/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-2/5 relative min-h-[250px] md:min-h-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-brand-gold text-black text-xs font-bold uppercase tracking-wider rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 group-hover:text-brand-gold transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-white/60 mb-6 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <Link href={`#`} className="inline-flex items-center gap-2 text-brand-gold font-semibold uppercase tracking-wider text-sm hover:text-brand-gold-300 transition-colors w-fit">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}

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
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                />
                <button type="submit" className="w-full btn-primary py-3">
                  Subscribe Now
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
