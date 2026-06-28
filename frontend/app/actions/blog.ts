'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getBlogPosts(publishedOnly = false) {
  try {
    return await prisma.blogPost.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      include: {
        author: {
          select: { name: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, image: true, role: true }
        }
      }
    })
  } catch (error) {
    console.error('Failed to get blog post:', error)
    return null
  }
}

export async function getBlogPostById(id: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error('Failed to get blog post by id:', error)
    return null
  }
}

export async function createBlogPost(data: {
  title: string
  slug: string
  content: string
  excerpt?: string
  imageUrl?: string
  isPublished: boolean
  authorId: string
}) {
  try {
    const post = await prisma.blogPost.create({ data })
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return { success: true, post }
  } catch (error: any) {
    console.error('Failed to create blog post:', error)
    if (error.code === 'P2002') return { success: false, error: 'Slug already exists' }
    return { success: false, error: 'Failed to create blog post' }
  }
}

export async function updateBlogPost(id: string, data: {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  imageUrl?: string
  isPublished?: boolean
}) {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data
    })
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')
    return { success: true, post }
  } catch (error: any) {
    console.error('Failed to update blog post:', error)
    if (error.code === 'P2002') return { success: false, error: 'Slug already exists' }
    return { success: false, error: 'Failed to update blog post' }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } })
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete blog post:', error)
    return { success: false, error: 'Failed to delete blog post' }
  }
}
