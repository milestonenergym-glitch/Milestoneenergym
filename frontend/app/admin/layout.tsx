'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  CalendarDays, 
  CalendarDays as Calendar, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Tag,
  Megaphone,
  UserCheck,
  ImageIcon as ImageIcon,
  FileText
} from 'lucide-react'

import { useSession, signOut } from 'next-auth/react'
// import { useAuthStore } from '@/store/authStore'
// import { api } from '@/lib/api'

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Members', href: '/admin/members', icon: UserCheck },
  { label: 'Attendance', href: '/admin/attendance', icon: Calendar },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Plans', href: '/admin/plans', icon: Tag },
  { label: 'Classes', href: '/admin/classes', icon: Dumbbell },
  { label: 'Trainers', href: '/admin/trainers', icon: Users },
  { label: 'Hero Banners', href: '/admin/hero', icon: ImageIcon },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Marketing Popup', href: '/admin/marketing-popup', icon: Megaphone },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const { data: session, status } = useSession()
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auth protection
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?returnUrl=' + encodeURIComponent(pathname))
    } else if (status === 'authenticated' && session?.user) {
      if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'RECEPTIONIST'].includes(session.user.role)) {
        router.push('/')
      }
    }
  }, [status, session, router, pathname])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-100 font-sans selection:bg-brand-gold/30 print:bg-white print:text-black">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`
          print:hidden
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-zinc-900 border-r border-white/5 
          flex flex-col transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${!isSidebarOpen ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-8 h-8 shrink-0 bg-black rounded-md overflow-hidden">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-bold text-sm tracking-widest text-brand-gold truncate">
                ENERGYM
              </span>
            )}
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-1 px-2">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                    ${isActive 
                      ? 'bg-brand-gold/10 text-brand-gold' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                  title={!isSidebarOpen ? link.label : undefined}
                >
                  <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-gold' : 'text-zinc-400 group-hover:text-white'}`} />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span className="font-medium text-sm truncate">{link.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        
        {/* Top Header */}
        <header className="h-16 bg-zinc-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 text-zinc-400 hover:text-white transition-transform"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search members, leads..." 
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold text-white placeholder:text-zinc-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-zinc-900"></span>
            </button>
            <div className="h-6 w-px bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0 border border-brand-gold/30">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block text-sm">
                <span className="font-semibold text-sm truncate">{session?.user?.name || 'Admin User'}</span>
                <span className="text-xs text-zinc-500 truncate capitalize">{session?.user?.role?.toLowerCase().replace('_', ' ') || 'Admin'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 print:bg-white p-4 sm:p-6 lg:p-8 print:p-0 scrollbar-hide">
          <div className="max-w-7xl mx-auto print:max-w-none print:mx-0">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  )
}
