'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBlogPostById, updateBlogPost } from '@/app/actions/blog'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    imageUrl: '',
    content: '',
    isPublished: false
  })

  useEffect(() => {
    async function loadPost() {
      const post = await getBlogPostById(params.id)
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          imageUrl: post.imageUrl || '',
          content: post.content,
          isPublished: post.isPublished
        })
      } else {
        toast.error('Post not found')
        router.push('/admin/blog')
      }
      setLoading(false)
    }
    loadPost()
  }, [params.id, router])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await updateBlogPost(params.id, formData)

    if (res.success) {
      toast.success('Blog post updated')
      router.push('/admin/blog')
    } else {
      toast.error(res.error || 'Failed to update blog post')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
            <p className="text-zinc-400 text-sm mt-1">Update your article.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              formData.isPublished 
                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            {formData.isPublished ? 'Published' : 'Draft'}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-gold text-black font-bold px-6 py-2 rounded-lg hover:bg-brand-gold/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Post Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g., Top 5 Workouts for Beginners" 
            required 
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-lg text-white focus:outline-none focus:border-brand-gold" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">URL Slug</label>
            <input 
              type="text" 
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
              placeholder="e.g., top-5-workouts" 
              required 
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Cover Image URL</label>
            <input 
              type="text" 
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="e.g., https://example.com/image.jpg" 
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Short Excerpt (Summary)</label>
          <textarea 
            value={formData.excerpt}
            onChange={e => setFormData({...formData, excerpt: e.target.value})}
            rows={2}
            placeholder="A brief summary of the article..."
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold resize-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center justify-between">
            <span>Main Content (HTML/Markdown supported)</span>
          </label>
          <textarea 
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            rows={15}
            required
            placeholder="Write your article content here..."
            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-brand-gold" 
          />
        </div>
      </div>
    </div>
  )
}
