'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getLeads, updateLeadStatus } from '@/app/actions/leads'
import { Mail, Phone, Calendar, User, CheckCircle2, XCircle, Clock, FileText, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    const data = await getLeads()
    setLeads(data)
    setLoading(false)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateLeadStatus(id, newStatus)
    if (res.success) {
      toast.success('Lead status updated')
      fetchLeads()
    } else {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'INTERESTED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'TRIAL': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'JOINED': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'LOST': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Management (CRM)</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage website inquiries and walk-ins.</p>
        </div>
        <button 
          onClick={fetchLeads}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-white/5"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <div className="animate-spin w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-2"></div>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No leads found. When someone fills the contact form, it will appear here.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lead.firstName} {lead.lastName !== '-' ? lead.lastName : ''}</div>
                      <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 px-2 py-0.5 rounded-sm inline-block ${lead.source === 'POPUP' ? 'bg-brand-blue/20 text-blue-400 border border-brand-blue/30' : 'text-zinc-500 bg-zinc-800'}`}>
                        {lead.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {lead.email && lead.email !== 'No email provided' && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {lead.email}</div>}
                      {lead.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {lead.phone}</div>}
                      {lead.pincode && <div className="flex items-center gap-2 text-brand-gold"><MapPin className="w-3 h-3" /> Pincode: {lead.pincode}</div>}
                    </td>
                    <td className="px-6 py-4 capitalize">{lead.subject || 'General'}</td>
                    <td className="px-6 py-4">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border focus:outline-none focus:ring-2 ring-brand-gold/50 appearance-none cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="TRIAL">Trial Booked</option>
                        <option value="JOINED">Joined</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="text-brand-gold hover:text-white transition-colors font-medium text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
          >
            <button 
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-gold" /> Lead Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-500 mb-1">Name</p>
                  <p className="font-semibold text-white">{selectedLead.firstName} {selectedLead.lastName}</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-500 mb-1">Status</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <a href={`mailto:${selectedLead.email}`} className="text-white hover:text-brand-gold transition-colors">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <a href={`tel:${selectedLead.phone}`} className="text-white hover:text-brand-gold transition-colors">{selectedLead.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-zinc-500 mb-2 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Message
                </p>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {selectedLead.message}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
