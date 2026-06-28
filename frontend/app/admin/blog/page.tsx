'use client'

import { useState, useEffect } from 'react'
import { getBlogPosts, deleteBlogPost } from '@/app/actions/blog'
import { Plus, Edit, Trash2, FileText, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const data = await getBlogPosts()
    setPosts(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    const res = await deleteBlogPost(id)
    if (res.success) {
      toast.success('Blog post deleted')
      fetchPosts()
    } else {
      toast.error(res.error || 'Failed to delete post')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your website's articles and news.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Posts Found</h3>
          <p className="text-zinc-400 text-sm max-w-md mb-6">Create your first blog post to engage with your members and improve SEO.</p>
          <Link href="/admin/blog/new" className="bg-brand-gold text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors">
            Write an Article
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 border-b border-white/10 text-sm">
                <tr>
                  <th className="px-6 py-4 text-zinc-400 font-medium">Title</th>
                  <th className="px-6 py-4 text-zinc-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-zinc-400 font-medium">Author</th>
                  <th className="px-6 py-4 text-zinc-400 font-medium">Date</th>
                  <th className="px-6 py-4 text-zinc-400 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{post.title}</div>
                      <div className="text-sm text-zinc-500 mt-1">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-500/10 text-zinc-400 text-xs font-medium border border-zinc-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {post.author?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/blog/${post.id}`}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
