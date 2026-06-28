'use client'

import { useState, useEffect } from 'react'
import { getTrainerProfiles, createTrainerProfile, deleteTrainerProfile } from '@/app/actions/trainers'
import { Plus, Trash2, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getTrainers } from '@/app/actions/classes' // Resuse to get Users with role TRAINER

export default function TrainersPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [profilesData, usersData] = await Promise.all([
      getTrainerProfiles(),
      getTrainers()
    ])
    setProfiles(profilesData)
    setUsers(usersData)
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      userId: formData.get('userId') as string,
      specialization: formData.get('specialization') as string,
      experienceYears: Number(formData.get('experienceYears')),
      bio: formData.get('bio') as string,
    }

    const res = await createTrainerProfile(data)
    if (res.success) {
      toast.success('Trainer Profile created')
      setIsModalOpen(false)
      fetchData()
    } else {
      toast.error(res.error || 'Failed to create profile')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    const res = await deleteTrainerProfile(id)
    if (res.success) {
      toast.success('Trainer Profile deleted')
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Trainer Profiles</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage trainer specializations and experience for the homepage.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gold text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Profile
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.length === 0 ? (
            <div className="col-span-full bg-zinc-900 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Profiles Found</h3>
              <p className="text-zinc-400 text-sm max-w-md">Add trainer profiles to showcase your elite team on the homepage.</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      {profile.user?.image ? (
                        <img src={profile.user.image} alt={profile.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-brand-gold font-bold text-xl">{profile.user?.name?.charAt(0) || 'T'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{profile.user?.name}</h3>
                      <p className="text-brand-gold text-sm">{profile.specialization || 'General Trainer'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(profile.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mt-4 text-sm text-zinc-400">
                  <p><span className="text-zinc-500">Experience:</span> {profile.experienceYears} Years</p>
                  {profile.bio && <p className="line-clamp-2"><span className="text-zinc-500">Bio:</span> {profile.bio}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add Trainer Profile</h2>
              <p className="text-zinc-400 text-sm mt-1">Select a user to upgrade to a featured trainer.</p>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Select Trainer</label>
                <select name="userId" required className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold">
                  <option value="">Select a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Specialization</label>
                  <input type="text" name="specialization" placeholder="e.g., CrossFit & Strength" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Experience (Years)</label>
                  <input type="number" name="experienceYears" required min="0" defaultValue="0" className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Short Bio</label>
                <textarea 
                  name="bio" 
                  rows={3}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold resize-none" 
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium hover:bg-white/5 transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-gold text-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
