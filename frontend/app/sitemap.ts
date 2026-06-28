import { MetadataRoute } from 'next'
import { getPlans } from '@/app/actions/plans'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milestoneenergym.com'

  // Standard routes
  const routes = [
    '',
    '/about',
    '/membership',
    '/classes',
    '/gallery',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch dynamic plans for deep linking (if applicable)
  // Or fetch blog posts when ready
  /*
  const posts = await getBlogPosts()
  const postRoutes = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))
  */

  return [...routes]
}
