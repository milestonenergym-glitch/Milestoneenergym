'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Tag, BookOpen } from 'lucide-react'

const posts = [
  {
    id: 'b1',
    title: '10 Science-Backed Tips to Maximize Your Muscle Growth',
    excerpt: 'Learn the proven strategies that top bodybuilders use to build lean muscle mass faster and more efficiently.',
    category: 'Training',
    readTime: '5 min read',
    date: 'June 15, 2025',
    slug: 'maximize-muscle-growth',
    gradient: 'from-brand-blue/30 to-transparent',
    accent: '#0F52BA',
  },
  {
    id: 'b2',
    title: 'The Ultimate Pre & Post Workout Nutrition Guide for Indians',
    excerpt: 'Discover the best Indian foods to eat before and after your workout to optimize performance and recovery.',
    category: 'Nutrition',
    readTime: '7 min read',
    date: 'June 10, 2025',
    slug: 'workout-nutrition-guide',
    gradient: 'from-brand-gold/20 to-transparent',
    accent: '#D4AF37',
  },
  {
    id: 'b3',
    title: 'CrossFit vs Gym Training: Which Is Better for Weight Loss?',
    excerpt: 'A comprehensive comparison of CrossFit and traditional gym training for achieving your fat loss goals.',
    category: 'CrossFit',
    readTime: '6 min read',
    date: 'June 5, 2025',
    slug: 'crossfit-vs-gym-training',
    gradient: 'from-red-500/20 to-transparent',
    accent: '#EF4444',
  },
]

export default function BlogPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="section-padding bg-[#080808]"
      id="blog-preview"
      aria-labelledby="blog-heading"
    >
      <div className="container-custom" ref={ref}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="section-label mb-3 inline-block">
              Fitness Knowledge
            </motion.span>
            <motion.h2
              id="blog-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Latest <span className="text-gradient">Articles</span>
            </motion.h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-brand-blue-300 hover:text-white text-sm font-medium transition-colors" id="view-all-blog">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className="glass rounded-2xl overflow-hidden border border-white/8 group hover:border-white/15 transition-all hover:-translate-y-1"
              id={`post-${post.id}`}
            >
              {/* Thumbnail */}
              <div className={`h-44 bg-gradient-to-br ${post.gradient} from-gray-800 to-gray-900 relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <BookOpen className="w-20 h-20" style={{ color: post.accent }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${post.accent}25`, color: post.accent }}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-white/30 text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: post.accent }}
                  id={`read-post-${post.id}`}
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
