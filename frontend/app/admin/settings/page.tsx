'use client'

import { useState, useEffect } from 'react'
import { getGymSettings, updateGymSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { Save, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getGymSettings()
      setSettings(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      gymName: formData.get('gymName') as string,
      contactPhone: formData.get('contactPhone') as string,
      contactEmail: formData.get('contactEmail') as string,
      address: formData.get('address') as string,
      facebookUrl: formData.get('facebookUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
    }

    const res = await updateGymSettings(data)
    if (res.success) {
      toast.success('Settings updated successfully!')
      setSettings(res.settings)
    } else {
      toast.error('Failed to update settings')
    }
    setSaving(false)
  }

  if (loading) return <div className="text-zinc-500 py-10">Loading settings...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Gym Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Update your gym's public information and social links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-gold" /> Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Gym Name</label>
              <input type="text" name="gymName" defaultValue={settings?.gymName} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Phone</label>
              <input type="text" name="contactPhone" defaultValue={settings?.contactPhone} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Email</label>
              <input type="email" name="contactEmail" defaultValue={settings?.contactEmail} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Full Address (Shows in Footer)</label>
              <textarea name="address" defaultValue={settings?.address} rows={2} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold resize-none" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-brand-gold" /> Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Instagram URL</label>
              <input type="url" name="instagramUrl" defaultValue={settings?.instagramUrl} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Facebook URL</label>
              <input type="url" name="facebookUrl" defaultValue={settings?.facebookUrl} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">YouTube URL</label>
              <input type="url" name="youtubeUrl" defaultValue={settings?.youtubeUrl} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-brand-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-brand-gold/90 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}
