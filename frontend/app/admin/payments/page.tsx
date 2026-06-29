'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPayments, deletePayment } from '@/app/actions/payments'
import { CreditCard, IndianRupee, Clock, CheckCircle2, XCircle, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    const data = await getPayments()
    setPayments(data)
    setLoading(false)
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
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {payment.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{payment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-zinc-500">{payment.user?.email || ''}</div>
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
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
