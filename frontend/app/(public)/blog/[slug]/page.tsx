import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.imageUrl ? [post.imageUrl] : []
    }
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(true)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post || !post.isPublished) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      <div className="container-custom max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors mb-8 text-sm uppercase tracking-wider font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <article className="glass rounded-3xl border border-white/10 overflow-hidden">
          {post.imageUrl && (
            <div className="w-full h-[300px] md:h-[450px] relative">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight uppercase">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-10 pb-10 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.name || 'Milestone Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div 
              className="prose prose-invert prose-brand max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
