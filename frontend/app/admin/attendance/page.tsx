'use client'

import { useState, useEffect } from 'react'
import { getMembers } from '@/app/actions/members'
import { markAttendance, getTodayAttendance } from '@/app/actions/attendance'
import { Search, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function AttendancePage() {
  const [members, setMembers] = useState<any[]>([])
  const [todayLogs, setTodayLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [membersData, logsData] = await Promise.all([
      getMembers(),
      getTodayAttendance()
    ])
    setMembers(membersData)
    setTodayLogs(logsData)
    setLoading(false)
  }

  const handleMarkPresent = async (userId: string) => {
    const res = await markAttendance(userId)
    if (res.success) {
      toast.success('Attendance marked!')
      fetchData() // Refresh logs
    } else {
      toast.error(res.error || 'Failed to mark attendance')
    }
  }

  const isCheckedIn = (userId: string) => {
    return todayLogs.some(log => log.userId === userId)
  }

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.profile?.phone?.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Attendance</h1>
          <p className="text-zinc-400 text-sm mt-1">Mark member check-ins for today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Search & Mark Attendance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
            <div className="relative w-full mb-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search member by name or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="text-center text-zinc-500 py-10">Loading members...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No members found.</div>
              ) : (
                filteredMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-zinc-950/50 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{member.profile?.phone || 'No phone'}</p>
                    </div>
                    
                    {isCheckedIn(member.id) ? (
                      <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full text-xs font-bold border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Checked In
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleMarkPresent(member.id)}
                        className="bg-zinc-800 hover:bg-brand-gold hover:text-black text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Mark Present
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Today's Log */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-gold" /> Today's Log
          </h2>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div>
              <p className="text-3xl font-bold text-white">{todayLogs.length}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Check-ins</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-brand-gold" />
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {todayLogs.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No check-ins yet today.</p>
            ) : (
              todayLogs.map(log => (
                <div key={log.id} className="flex justify-between items-center">
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{log.user?.name}</p>
                    <p className="text-xs text-zinc-500">{new Date(log.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
