'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMembers, createMember, updateMemberProfile, assignMembershipToMember } from '@/app/actions/members'
import { getPlans } from '@/app/actions/plans'
import { generateRegistrationLink } from '@/app/actions/registration-links'
import { UserPlus, Search, MoreVertical, Phone, Calendar, Printer, Activity, X, MessageCircle, FileEdit, Link as LinkIcon, CheckCircle2, Download } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<'CHOICE' | 'MANUAL' | 'WHATSAPP'>('CHOICE')
  const [generatedLink, setGeneratedLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  
  // Plan assignment state
  const [assignDurationMonths, setAssignDurationMonths] = useState('')
  const [assignStartDate, setAssignStartDate] = useState(new Date().toISOString().split('T')[0])
  const [assignEndDate, setAssignEndDate] = useState('')
  const [assignActualAmount, setAssignActualAmount] = useState('')
  const [assignPdfAmount, setAssignPdfAmount] = useState('')
  const [assignPaymentMode, setAssignPaymentMode] = useState('CASH')

  // Auto-calculate end date when duration or start date changes
  useEffect(() => {
    if (assignDurationMonths && assignStartDate) {
      const months = parseInt(assignDurationMonths, 10)
      if (!isNaN(months)) {
        const start = new Date(assignStartDate)
        const end = new Date(start)
        end.setDate(end.getDate() + (months * 30))
        setAssignEndDate(end.toISOString().split('T')[0])
      }
    }
  }, [assignDurationMonths, assignStartDate])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [membersData, plansData] = await Promise.all([
      getMembers(),
      getPlans()
    ])
    setMembers(membersData)
    setPlans(plansData)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    // Calculate duration based on selected plan
    const planId = formData.get('planId') as string
    const selectedPlan = plans.find(p => p.id === planId)
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      dateOfBirth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string) : undefined,
      bloodGroup: formData.get('bloodGroup'),
      emergencyContact: formData.get('emergencyContact'),
      address: formData.get('address'),
      planId,
      durationInDays: selectedPlan?.durationInDays || 0,
      amountPaid: formData.get('amountPaid') || selectedPlan?.price || 0,
      pdfAmount: formData.get('pdfAmount') || null,
      paymentMode: formData.get('paymentMode') || 'CASH',
    }

    const res = await createMember(data)
    if (res.success) {
      toast.success('Member added successfully!')
      setIsModalOpen(false)
      fetchData()
    } else {
      toast.error(res.error || 'Failed to add member')
    }
    setIsSubmitting(false)
  }

  const handleGenerateLink = async () => {
    setIsSubmitting(true)
    const res = await generateRegistrationLink()
    if (res.success) {
      const link = `${window.location.origin}/register/${res.token}`
      setGeneratedLink(link)
      setModalStep('WHATSAPP')
    } else {
      toast.error(res.error || 'Failed to generate link')
    }
    setIsSubmitting(false)
  }

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Hello! Welcome to Milestone Energym. Please fill out your gym registration form by clicking the link below:\n\n${generatedLink}\n\n*Note: This link will expire in 30 minutes.*`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.profile?.phone?.includes(searchTerm)
  )

  const openEditModal = (member: any) => {
    setEditingMember(member)
    setIsEditModalOpen(true)
    // Reset plan assignment fields
    setAssignDurationMonths('')
    setAssignActualAmount('')
    setAssignPdfAmount('')
    setAssignPaymentMode('CASH')
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingMember) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      dateOfBirth: formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string) : undefined,
      bloodGroup: formData.get('bloodGroup'),
      emergencyContact: formData.get('emergencyContact'),
      address: formData.get('address'),
    }
    const res = await updateMemberProfile(editingMember.id, data)
    if (res.success) {
      toast.success('Profile updated successfully!')
      fetchData()
    } else {
      toast.error(res.error || 'Failed to update profile')
    }
    setIsSubmitting(false)
  }

  const handleAssignPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingMember || !assignDurationMonths) return
    setIsSubmitting(true)
    const data = {
      durationMonths: assignDurationMonths,
      startDate: assignStartDate,
      endDate: assignEndDate,
      amountPaid: assignActualAmount,
      pdfAmount: assignPdfAmount,
      paymentMode: assignPaymentMode,
    }
    const res = await assignMembershipToMember(editingMember.id, data)
    if (res.success) {
      toast.success('Plan assigned successfully!')
      setIsEditModalOpen(false)
      fetchData()
    } else {
      toast.error(res.error || 'Failed to assign plan')
    }
    setIsSubmitting(false)
  }

  const getMembershipStatus = (member: any) => {
    if (!member.memberships || member.memberships.length === 0) {
      if (member.profile?.requestedDuration) {
        return <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-500/20">PENDING</span>
      }
      return <span className="bg-zinc-500/10 text-zinc-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-zinc-500/20">NO PLAN</span>
    }
    const current = member.memberships[0]
    const endDate = new Date(current.endDate)
    const now = new Date()
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <span className="bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-500/20">EXPIRED</span>
    } else if (diffDays <= 7) {
      return <span className="bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-orange-500/20">EXPIRING ({diffDays}d)</span>
    } else {
      return <span className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-500/20">ACTIVE</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Member Directory</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage all your gym members in one place.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>
          <button 
            onClick={() => {
              setModalStep('CHOICE')
              setIsModalOpen(true)
            }}
            className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Member Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Current Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <div className="animate-spin w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-2"></div>
                    Loading members...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xs shrink-0 border border-brand-gold/30">
                          {member.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{member.name}</div>
                          <div className="text-xs text-zinc-500">ID: {member.id.substring(member.id.length - 6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {member.profile?.phone || 'N/A'}</div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {member.memberships && member.memberships.length > 0 ? (
                        <>
                          <div className="font-medium text-white">{member.memberships[0].plan.name}</div>
                          <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> 
                            {new Date(member.memberships[0].endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </>
                      ) : member.profile?.requestedDuration ? (
                        <>
                          <div className="font-medium text-brand-gold">{member.profile.requestedDuration}</div>
                          <div className="text-xs text-zinc-500 mt-1 italic">Requested (Pending)</div>
                        </>
                      ) : (
                        <span className="text-zinc-600 italic">No Plan</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getMembershipStatus(member)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link 
                        href={`/admin/members/${member.id}/contract`}
                        target="_blank"
                        className="text-zinc-500 hover:text-brand-gold transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Print Contract"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/members/${member.id}/contract?download=true`}
                        target="_blank"
                        className="text-zinc-500 hover:text-brand-gold transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Link>
                      <button  
                        onClick={() => openEditModal(member)}
                        className="text-zinc-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Edit Member"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl my-8 relative"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-900 z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Add New Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {modalStep === 'CHOICE' && (
              <div className="p-8 space-y-6">
                <p className="text-zinc-400 text-center mb-6">How would you like to add this member?</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleGenerateLink}
                    disabled={isSubmitting}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors text-white disabled:opacity-50"
                  >
                    <MessageCircle className="w-10 h-10 text-brand-gold" />
                    <div className="text-center">
                      <div className="font-bold mb-1">Send WhatsApp Link</div>
                      <div className="text-xs text-zinc-400">Customer fills form (30 min expiry)</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setModalStep('MANUAL')}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-white"
                  >
                    <FileEdit className="w-10 h-10 text-zinc-400" />
                    <div className="text-center">
                      <div className="font-bold mb-1">Fill Manually</div>
                      <div className="text-xs text-zinc-400">You enter details right now</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'WHATSAPP' && (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Registration Link Generated!</h3>
                  <p className="text-zinc-400 text-sm">Send this link to the customer via WhatsApp.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 rounded-lg p-3 overflow-hidden">
                  <LinkIcon className="w-5 h-5 text-zinc-500 shrink-0" />
                  <input type="text" readOnly value={generatedLink} className="w-full bg-transparent text-sm text-zinc-300 outline-none" />
                  <button onClick={() => {navigator.clipboard.writeText(generatedLink); toast.success('Link Copied!')}} className="text-brand-gold text-sm font-semibold whitespace-nowrap hover:underline">
                    Copy
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                    Close
                  </button>
                  <button onClick={openWhatsApp} className="flex-1 py-3 px-4 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20b858] transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" /> Send on WhatsApp
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'MANUAL' && (
              <form onSubmit={handleCreate} className="p-6 space-y-6">
                {/* Personal Details */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-gold mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Personal Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name *</label>
                      <input type="text" name="name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Phone Number *</label>
                      <input type="tel" name="phone" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
                      <input type="email" name="email" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Date of Birth</label>
                      <input type="date" name="dateOfBirth" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Gender</label>
                      <select name="gender" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold appearance-none">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Blood Group</label>
                      <input type="text" name="bloodGroup" placeholder="e.g. O+" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Address</label>
                      <input type="text" name="address" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Emergency Contact Name</label>
                      <input type="text" name="emergencyContact" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Emergency Contact Phone</label>
                      <input type="tel" name="emergencyContactPhone" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                  </div>
                </div>

                {/* Membership Assignment */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-brand-gold mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Assign Plan
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Select Package</label>
                      <select 
                        name="planId" 
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold appearance-none mb-4"
                        onChange={(e) => {
                          const plan = plans.find(p => p.id === e.target.value);
                          if (plan) {
                            (document.getElementById('manualAmountPaid') as HTMLInputElement).value = plan.price.toString();
                            (document.getElementById('manualPdfAmount') as HTMLInputElement).value = plan.price.toString();
                          } else {
                            (document.getElementById('manualAmountPaid') as HTMLInputElement).value = '';
                            (document.getElementById('manualPdfAmount') as HTMLInputElement).value = '';
                          }
                        }}
                      >
                        <option value="">No Plan (Add Profile Only)</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - ₹{p.price} ({p.durationInDays} days)</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Actual Amount (₹) <span className="text-xs text-zinc-500">(For System)</span></label>
                      <input type="number" name="amountPaid" id="manualAmountPaid" placeholder="e.g. 5000" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">PDF Amount (₹) <span className="text-xs text-zinc-500">(Optional)</span></label>
                      <input type="number" name="pdfAmount" id="manualPdfAmount" placeholder="e.g. 6000" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Mode of Payment</label>
                      <select name="paymentMode" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold appearance-none">
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-xl font-bold transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Member'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
      {/* Edit Member Modal */}
      {isEditModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl my-8 relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center absolute top-0 left-0 right-0 bg-zinc-900 z-10 rounded-t-2xl md:hidden">
              <h2 className="text-xl font-bold text-white">Edit Member</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Edit Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-white/10 mt-16 md:mt-0">
              <div className="hidden md:flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Full Name</label>
                  <input type="text" name="name" defaultValue={editingMember.name || ''} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Phone</label>
                    <input type="tel" name="phone" defaultValue={editingMember.profile?.phone || ''} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Email</label>
                    <input type="email" name="email" defaultValue={editingMember.email || ''} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Date of Birth</label>
                    <input type="date" name="dateOfBirth" defaultValue={editingMember.profile?.dateOfBirth ? new Date(editingMember.profile.dateOfBirth).toISOString().split('T')[0] : ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Gender</label>
                    <select name="gender" defaultValue={editingMember.profile?.gender || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Address</label>
                  <input type="text" name="address" defaultValue={editingMember.profile?.address || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Emergency Contact</label>
                    <input type="tel" name="emergencyContact" defaultValue={editingMember.profile?.emergencyContact || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Blood Group</label>
                    <input type="text" name="bloodGroup" defaultValue={editingMember.profile?.bloodGroup || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Profile Details'}
                </button>
              </form>
            </div>

            {/* Plan Assignment Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 bg-black/20 overflow-y-auto">
              <div className="hidden md:flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Assign Plan</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editingMember.memberships?.length > 0 ? (
                <div className="bg-brand-gold/10 border border-brand-gold/20 p-4 rounded-xl">
                  <p className="text-brand-gold mb-2 font-semibold">Active Plan Exists</p>
                  <p className="text-sm text-zinc-400">This member already has an active plan: {editingMember.memberships[0].plan.name}.</p>
                </div>
              ) : (
                <form onSubmit={handleAssignPlan} className="space-y-4">
                  {editingMember.profile?.requestedDuration && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-500 text-sm">
                      <strong>Note:</strong> Customer requested <strong>{editingMember.profile.requestedDuration}</strong> via WhatsApp registration.
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Duration (Months)</label>
                    <select 
                      value={assignDurationMonths} 
                      onChange={(e) => setAssignDurationMonths(e.target.value)}
                      required 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                    >
                      <option value="">Select duration...</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Month{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Start Date</label>
                      <input 
                        type="date" 
                        value={assignStartDate}
                        onChange={(e) => setAssignStartDate(e.target.value)}
                        required 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">End Date</label>
                      <input 
                        type="date" 
                        value={assignEndDate}
                        readOnly
                        className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">Actual Amount (₹) <span className="text-xs text-zinc-500">(For System)</span></label>
                      <input 
                        type="number" 
                        value={assignActualAmount}
                        onChange={(e) => setAssignActualAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        required 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-400">PDF Amount (₹) <span className="text-xs text-zinc-500">(Optional)</span></label>
                      <input 
                        type="number" 
                        value={assignPdfAmount}
                        onChange={(e) => setAssignPdfAmount(e.target.value)}
                        placeholder="e.g. 6000"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Mode of Payment</label>
                    <select 
                      value={assignPaymentMode} 
                      onChange={(e) => setAssignPaymentMode(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting || !assignDurationMonths} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-brand-gold/90 transition-colors disabled:opacity-50 mt-4">
                    {isSubmitting ? 'Assigning...' : 'Assign Plan & Mark Paid'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
