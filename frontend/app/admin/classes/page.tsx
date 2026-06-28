'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getClasses, createClass, deleteClass, getTrainers } from '@/app/actions/classes'
import { Plus, Trash2, Clock, Users, Dumbbell, UserCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [classesData, trainersData] = await Promise.all([
      getClasses(),
      getTrainers()
    ])
    setClasses(classesData)
    setTrainers(trainersData)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      capacity: Number(formData.get('capacity')),
      scheduleTime: formData.get('scheduleTime') as string,
      trainerId: formData.get('trainerId') as string || undefined
    }

    const res = await createClass(data)
    if (res.success) {
      toast.success('Class scheduled successfully')
      setIsModalOpen(false)
      fetchData()
    } else {
      toast.error(res.error || 'Failed to create class')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    const res = await deleteClass(id)
    if (res.success) {
      toast.success('Class removed')
      fetchData()
    } else {
      toast.error(res.error || 'Failed to delete class')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Classes & Schedule</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage gym group classes and assign trainers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Schedule Class
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Classes Scheduled</h3>
              <p className="text-zinc-400 text-sm max-w-md">Schedule your first group class like Zumba or Yoga to get started.</p>
            </div>
          ) : (
            classes.map((gymClass) => (
              <motion.div 
                key={gymClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{gymClass.name}</h3>
                  <button onClick={() => handleDelete(gymClass.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {gymClass.description && (
                  <p className="text-zinc-400 text-sm mb-6 flex-1">{gymClass.description}</p>
                )}

                <div className="space-y-3 mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Clock className="w-4 h-4 text-brand-gold" /> {gymClass.scheduleTime}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Users className="w-4 h-4 text-brand-gold" /> Max Capacity: {gymClass.capacity} Members
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <UserCheck className="w-4 h-4 text-brand-gold" /> Trainer: {gymClass.trainer?.name || 'Unassigned'}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Schedule New Class</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Class Name</label>
                <input type="text" name="name" required placeholder="e.g., Morning Yoga" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Capacity</label>
                  <input type="number" name="capacity" required placeholder="20" min="1" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Assign Trainer</label>
                  <select name="trainerId" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold appearance-none">
                    <option value="">No Trainer</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Schedule Timing</label>
                <input type="text" name="scheduleTime" required placeholder="e.g., Mon-Wed-Fri 7:00 AM" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description (Optional)</label>
                <textarea name="description" rows={2} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold resize-none" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
