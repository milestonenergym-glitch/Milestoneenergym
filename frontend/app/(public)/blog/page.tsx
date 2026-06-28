import { getBlogPosts } from '@/app/actions/blog'
import BlogFeed from '@/components/public/blog/BlogFeed'

export default async function BlogPage() {
  const blogPosts = await getBlogPosts(true)
  
  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Fitness <span className="text-brand-gold">Insights</span>
          </h1>
          <p className="text-lg text-white/60">
            Expert advice, training tips, nutritional guides, and the latest news from the Milestone Energym team.
          </p>
        </div>
      </div>

      <div className="container-custom">
        <BlogFeed blogPosts={blogPosts} />
      </div>
    </div>
  )
}
