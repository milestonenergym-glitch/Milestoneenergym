"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { submitLead } from '@/app/actions/leads'
import { getGymSettings } from '@/app/actions/settings'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    getGymSettings().then(data => setSettings(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    const result = await submitLead(formData)
    
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24">
      {/* Header */}
      <div className="container-custom mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight uppercase">
            Get In <span className="text-brand-blue-400">Touch</span>
          </h1>
          <p className="text-lg text-white/60">
            Have questions about our memberships, classes, or facilities? We're here to help. Reach out to us and our team will get back to you shortly.
          </p>
        </motion.div>
      </div>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold font-heading mb-8 uppercase">Contact <span className="text-brand-gold">Details</span></h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-white/60 text-sm mb-1">Mon-Sat from 5:30am to 10:30pm.</p>
                <a href={`tel:${settings?.contactPhone?.replace(/[^0-9+]/g, '') || '+918875305442'}`} className="text-brand-gold font-semibold hover:underline">
                  {settings?.contactPhone || '+91 88753 05442'}
                </a>
              </div>

              {/* Email */}
              <div className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-white/60 text-sm mb-1">Our friendly team is here to help.</p>
                <a href={`mailto:${settings?.contactEmail || 'Milestonenergym@gmail.com'}`} className="text-brand-gold font-semibold hover:underline break-all">
                  {settings?.contactEmail || 'Milestonenergym@gmail.com'}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Office</h3>
                <p className="text-white/60 mb-2 leading-relaxed whitespace-pre-wrap">
                  {settings?.address || 'Milestone Energym\nनवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर,\nBarmer, Rajasthan - 344001\nIndia'}
                </p>
                <a href={settings?.googleMapsUrl || '#'} target={settings?.googleMapsUrl ? "_blank" : undefined} className="text-brand-gold text-sm font-semibold hover:underline uppercase tracking-wider">Get Directions</a>
              </div>
            </div>

            {/* Hours */}
            <div className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-full">
                <h3 className="font-bold mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  {settings?.businessHours ? (
                    JSON.parse(settings.businessHours).map((bh: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/60">{bh.day}</span>
                        <span className={`font-semibold ${bh.time.toLowerCase().includes('close') ? 'text-brand-gold' : 'text-white'}`}>{bh.time}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-white/60">Monday - Saturday</span>
                        <span className="font-semibold text-white">5:30 AM - 10:30 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Sunday</span>
                        <span className="font-semibold text-brand-gold">Closed / Off</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 md:p-10 rounded-3xl border border-white/10 h-fit"
          >
            <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/60">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-brand-gold hover:underline">Send another message</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                    {errorMessage}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="John"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 9876543210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Subject</label>
                  <select
                    name="subject"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="" disabled selected className="bg-black text-white">Select a subject</option>
                    <option value="membership" className="bg-black text-white">Membership Inquiries</option>
                    <option value="pt" className="bg-black text-white">Personal Training</option>
                    <option value="billing" className="bg-black text-white">Billing & Payments</option>
                    <option value="feedback" className="bg-black text-white">Feedback</option>
                    <option value="other" className="bg-black text-white">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
