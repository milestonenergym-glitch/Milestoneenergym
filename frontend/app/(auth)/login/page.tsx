'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Dumbbell, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

import { signIn } from 'next-auth/react'
// import { api } from '@/lib/api'
// import { useAuthStore } from '@/store/authStore'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  identifier: z.string().min(3, { message: 'Email or phone is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <Link href="/" className="mb-6 flex items-center justify-center relative w-16 h-16 bg-black/50 rounded-full border border-white/5 p-2">
              <Image src="/logo.jpg" alt="Milestone Energym" fill className="object-contain p-2 rounded-full" style={{ clipPath: 'circle(45% at 50% 50%)' }} />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-zinc-400 text-sm">Enter your credentials to access the portal</p>
          </div>

          <Suspense fallback={<div className="text-center text-white/50">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard'
  
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null)
      
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        // NextAuth handles the session, just redirect
        router.push(returnUrl)
        router.refresh() // Force refresh to get session state
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-zinc-300 text-sm font-medium">Email or Phone Number</label>
              <input
                id="identifier"
                placeholder="admin@milestoneenergym.com"
                className="w-full bg-black/50 border border-white/10 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold h-12 px-4 transition-colors"
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-xs text-red-400">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-zinc-300 text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-gold hover:text-brand-gold/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold h-12 px-4 transition-colors"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold mt-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-zinc-300 text-sm font-medium">Email or Phone Number</label>
          <input
            id="identifier"
            placeholder="admin@milestoneenergym.com"
            className="w-full bg-black/50 border border-white/10 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold h-12 px-4 transition-colors"
            {...register('identifier')}
          />
          {errors.identifier && (
            <p className="text-xs text-red-400">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-zinc-300 text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs text-brand-gold hover:text-brand-gold/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 border border-white/10 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold h-12 px-4 transition-colors"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold mt-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-500">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </>
  )
}
