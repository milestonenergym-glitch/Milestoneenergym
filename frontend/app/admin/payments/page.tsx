'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPayments, deletePayment } from '@/app/actions/payments'
import { settleDues } from '@/app/actions/members'
import { CreditCard, IndianRupee, Clock, CheckCircle2, XCircle, Search, Trash2, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSettleDuesModalOpen, setIsSettleDuesModalOpen] = useState(false)
  const [settleMembership, setSettleMembership] = useState<any>(null)
  const [settleAmount, setSettleAmount] = useState('')
  const [settlePaymentMode, setSettlePaymentMode] = useState('CASH')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    const data = await getPayments()
    setPayments(data)
    setLoading(false)
  }

  const openSettleDuesModal = (membership: any) => {
    setSettleMembership(membership)
    setSettleAmount('')
    setSettlePaymentMode('CASH')
    setIsSettleDuesModalOpen(true)
  }

  const handleSettleDues = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!settleMembership || !settleAmount) return
    setIsSubmitting(true)
    const res = await settleDues(settleMembership.id, Number(settleAmount), settlePaymentMode)
    if (res.success) {
      toast.success('Dues settled successfully!')
      setIsSettleDuesModalOpen(false)
      fetchPayments()
    } else {
      toast.error(res.error || 'Failed to settle dues')
    }
    setIsSubmitting(false)
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      return
    }
    const res = await deletePayment(paymentId)
    if (res.success) {
      toast.success("Payment deleted successfully")
      fetchPayments()
    } else {
      toast.error(res.error || "Failed to delete payment")
    }
  }

  const filteredPayments = payments.filter(p => 
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'SUCCESS': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'PENDING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Ledger</h1>
          <p className="text-zinc-400 text-sm mt-1">Track all gym revenue, renewals, and transactions.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search member or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>
          <button 
            onClick={fetchPayments}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-white/5"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Member Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    <div className="animate-spin w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-2"></div>
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const activeMembership = payment.user?.memberships?.[0]
                  const hasPendingDues = activeMembership && activeMembership.pendingDues > 0

                  return (
                  <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {payment.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{payment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-zinc-500">{payment.user?.email || ''}</div>
                      {hasPendingDues && (
                        <div className="text-xs text-red-500 mt-1 font-semibold">
                          Pending: ₹{activeMembership.pendingDues.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{payment.description || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-white">
                        <IndianRupee className="w-3 h-3 text-brand-gold" />
                        {payment.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 w-fit">
                        <CreditCard className="w-3 h-3 text-zinc-400" />
                        {payment.paymentMode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${getStatusStyle(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {hasPendingDues && (
                        <button 
                          onClick={() => openSettleDuesModal(activeMembership)}
                          className="text-zinc-500 hover:text-green-500 transition-colors p-2 rounded-lg hover:bg-white/5"
                          title="Settle Pending Dues"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Dues Modal */}
      {isSettleDuesModalOpen && settleMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md my-8 relative"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-900 z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Settle Pending Dues</h2>
              <button onClick={() => setIsSettleDuesModalOpen(false)} className="text-zinc-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSettleDues} className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                  <div className="text-sm text-red-500 mb-1">Total Pending Amount</div>
                  <div className="text-2xl font-bold text-red-500">₹{settleMembership.pendingDues.toLocaleString('en-IN')}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Amount Being Paid (₹)</label>
                  <input 
                    type="number" 
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    max={settleMembership.pendingDues}
                    placeholder="e.g. 1000"
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Mode of Payment</label>
                  <select 
                    value={settlePaymentMode} 
                    onChange={(e) => setSettlePaymentMode(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-brand-gold/90 transition-colors disabled:opacity-50 mt-4">
                  {isSubmitting ? 'Processing...' : '✅ Settle Dues & Print Receipt'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
