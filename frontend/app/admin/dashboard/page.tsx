'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, IndianRupee, Activity, TrendingUp, Dumbbell, Calendar, Clock } from 'lucide-react'
import { api } from '@/lib/api'

import { getDashboardStats, getExpiringMembers } from '@/app/actions/dashboard'
import { MessageCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeMembersCount: 0,
    newLeadsCount: 0,
    monthlyRevenue: 0,
    expiringMembershipsCount: 0
  })
  const [expiringMembers, setExpiringMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const [data, expiring] = await Promise.all([
        getDashboardStats(),
        getExpiringMembers()
      ])
      setStats(data)
      setExpiringMembers(expiring)
      setLoading(false)
    }
    loadStats()
  }, [])

  const STATS_CARDS = [
    { label: 'Total Active Members', value: stats.activeMembersCount.toString(), icon: Users, change: 'Current', positive: true },
    { label: 'New Leads', value: stats.newLeadsCount.toString(), icon: UserPlus, change: 'This week', positive: true },
    { label: 'Monthly Revenue', value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, change: 'This month', positive: true },
    { label: 'Expiring Memberships', value: stats.expiringMembershipsCount.toString(), icon: Activity, change: 'Next 7 days', positive: false },
  ]

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-zinc-400 text-sm mt-1">Here's what's happening at Milestone Energym today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors">
            + New Member
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
           Array(4).fill(0).map((_, i) => (
             <div key={i} className="bg-zinc-900 border border-white/5 rounded-xl p-5 h-[120px] animate-pulse flex flex-col justify-between">
               <div className="flex justify-between">
                 <div className="w-10 h-10 bg-zinc-800 rounded-lg"></div>
                 <div className="w-16 h-5 bg-zinc-800 rounded-md"></div>
               </div>
               <div className="w-24 h-6 bg-zinc-800 rounded mt-4"></div>
             </div>
           ))
        ) : (
          STATS_CARDS.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-white/5 rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 text-zinc-400">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-md ${stat.positive ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-zinc-400 text-sm font-medium">{stat.label}</h3>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart / Analytics Area */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
            <select className="bg-zinc-800 border border-white/10 rounded-md text-xs px-2 py-1 text-zinc-300 focus:outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-zinc-950/50">
            <p className="text-zinc-500 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Chart Integration Pending
            </p>
          </div>
        </div>

        {/* Right Sidebar - Quick Actions & Recent Activity */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-zinc-300 font-medium">
                <Dumbbell className="w-4 h-4 text-brand-gold" /> Add New Class
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-zinc-300 font-medium">
                <UserPlus className="w-4 h-4 text-brand-gold" /> Log a Walk-in Lead
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-zinc-300 font-medium">
                <Calendar className="w-4 h-4 text-brand-gold" /> View Today's Schedule
              </button>
            </div>
          </div>

          {/* Expiring Soon / Renewals */}
          <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Expiring Soon</h2>
              <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full font-medium">Action Needed</span>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : expiringMembers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-zinc-500 text-sm">No memberships expiring soon. Great job!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {expiringMembers.map((membership: any) => {
                  const daysLeft = Math.ceil((new Date(membership.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                  const isExpired = daysLeft < 0
                  
                  const message = `Hi ${membership.user.name || 'Member'}, your gym membership at Milestone Energym ${isExpired ? 'expired' : 'is expiring'} on ${new Date(membership.endDate).toLocaleDateString('en-IN')}. Please renew to avoid interruptions.`
                  const waLink = `https://wa.me/91${membership.user.profile?.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(message)}`

                  return (
                    <div key={membership.id} className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-800/50 border border-white/5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-white font-medium">{membership.user.name || 'Unknown User'}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{membership.plan.name}</p>
                        </div>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {isExpired ? 'Expired' : `${daysLeft} days left`}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                        <span className="text-xs text-zinc-500">
                          {new Date(membership.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        
                        <a 
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-md transition-colors font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Remind
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
