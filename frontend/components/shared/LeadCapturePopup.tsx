'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitPopupLead } from '@/app/actions/leads'
import { Dumbbell, User, Phone, Mail, Calendar, Users, Target, Clock, MessageSquare, Ticket, CheckCircle2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function LeadCapturePopup() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('hasSubmittedPopupLead')
    // If not submitted, and currently not showing, and hasn't just succeeded, and not on admin or register pages
    if (!hasSubmitted && !show && !success && !pathname.startsWith('/admin') && !pathname.startsWith('/register')) {
      const timer = setTimeout(() => {
        setShow(true)
      }, 5000) // Wait 5 seconds before showing again
      return () => clearTimeout(timer)
    }
  }, [show, success, pathname])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      age: formData.get('age') as string,
      gender: formData.get('gender') as string,
      goal: formData.get('goal') as string,
      time: formData.get('time') as string,
      message: formData.get('message') as string,
    }

    const res = await submitPopupLead(data)
    
    if (res.success) {
      localStorage.setItem('hasSubmittedPopupLead', 'true')
      setSuccess(true)
      setTimeout(() => setShow(false), 3000)
    } else {
      setError(res.error || 'Failed to submit. Please try again.')
    }
    setLoading(false)
  }

  // Label component to match the design exactly
  const Label = ({ icon: Icon, text, required = false }: any) => (
    <label className="flex items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">
      <Icon className="w-3.5 h-3.5" />
      <span>{text} {required && <span className="text-white/30">*</span>}</span>
    </label>
  )

  const inputClasses = "w-full bg-[#27272a] border border-white/5 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-blue-400 transition-colors text-sm"
  const selectClasses = "w-full bg-[#27272a] border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue-400 transition-colors text-sm appearance-none"

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop (Click to close) */}
          <motion.div
            onClick={() => setShow(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#18181b] border border-white/10 shadow-2xl my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10">
                  <Ticket className="w-4 h-4 text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">FREE — No Credit Card Required</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                  Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Free</span> Trial
                </h2>
                <p className="text-white/60 text-xs md:text-sm px-4">
                  Experience Milestone Energym for one full day — absolutely free. No commitment required.
                </p>
              </div>

              {/* Success State */}
              {success ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
                  <p className="text-white/60">We will contact you shortly to confirm your trial slot.</p>
                </motion.div>
              ) : (
                /* Form Box */
                <div className="bg-[#1e1e22] border border-white/5 rounded-2xl p-5 md:p-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label icon={User} text="Full Name" required />
                        <input type="text" name="name" required placeholder="Your full name" className={inputClasses} />
                      </div>
                      <div>
                        <Label icon={Phone} text="Phone Number" required />
                        <input type="tel" name="phone" required placeholder="10-digit mobile number" className={inputClasses} />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label icon={Mail} text="Email Address" />
                        <input type="email" name="email" placeholder="Your email (optional)" className={inputClasses} />
                      </div>
                      <div>
                        <Label icon={Calendar} text="Age" required />
                        <input type="number" name="age" required placeholder="Your age" className={inputClasses} />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label icon={Users} text="Gender" required />
                        <div className="relative">
                          <select name="gender" required className={selectClasses} defaultValue="">
                            <option value="" disabled>Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                        </div>
                      </div>
                      <div>
                        <Label icon={Target} text="Fitness Goal" required />
                        <div className="relative">
                          <select name="goal" required className={selectClasses} defaultValue="">
                            <option value="" disabled>Select your goal</option>
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="General Fitness">General Fitness</option>
                            <option value="Endurance">Endurance & Cardio</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                        </div>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label icon={Clock} text="Preferred Time" required />
                        <div className="relative">
                          <select name="time" required className={selectClasses} defaultValue="">
                            <option value="" disabled>Select preferred time</option>
                            <option value="Morning (6AM - 11AM)">Morning (6AM - 11AM)</option>
                            <option value="Afternoon (11AM - 4PM)">Afternoon (11AM - 4PM)</option>
                            <option value="Evening (4PM - 10PM)">Evening (4PM - 10PM)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                        </div>
                      </div>
                      {/* Empty right column just like design */}
                      <div className="hidden md:block"></div>
                    </div>

                    {/* Row 5 */}
                    <div>
                      <Label icon={MessageSquare} text="Message (Optional)" />
                      <textarea 
                        name="message" 
                        rows={3} 
                        placeholder="Any questions or special requirements?" 
                        className={inputClasses + " resize-none"}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(29,78,216,0.3)] disabled:opacity-50 mt-4"
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Dumbbell className="w-5 h-5" />
                          Book My Free Trial Day
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[11px] text-white/40 mt-4">
                      By submitting, you agree to our Terms & Privacy Policy. We never spam.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
