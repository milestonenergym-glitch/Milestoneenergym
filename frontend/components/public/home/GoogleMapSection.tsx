'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Navigation, Phone, MessageCircle, MapPin } from 'lucide-react'

export default function GoogleMapSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const gymAddress = encodeURIComponent('नवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर, Barmer, Rajasthan-344001')
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${gymAddress}&zoom=15`
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${gymAddress}`

  return (
    <section
      className="section-padding bg-[#0A0A0A]"
      id="location"
      aria-labelledby="location-heading"
    >
      <div className="container-custom" ref={ref}>
        <div className="text-center mb-12">
          <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="section-label mb-4 inline-block">
            Find Us
          </motion.span>
          <motion.h2
            id="location-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Visit <span className="text-gradient">Milestone Energym</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50"
          >
            We're conveniently located with ample parking. Come visit us today!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Map */}
          <div className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-white/10 h-[400px] relative">
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Milestone Energym Location"
              />
            ) : (
              // Placeholder when no API key
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-blue/10 to-transparent">
                <MapPin className="w-16 h-16 text-brand-blue/40 mb-4" />
                <p className="text-white/40 text-sm text-center px-6">
                  Google Maps will appear here.<br />
                  Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
                </p>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="glass rounded-2xl border border-white/10 p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-xl mb-6">Gym Details</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-blue-300" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Address</div>
                    <div className="text-white text-sm leading-relaxed">
                      नवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर,<br />
                      Barmer, Rajasthan - 344001,<br />
                      India
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-blue-300" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Phone</div>
                    <a href="tel:+918875305442" className="text-white text-sm hover:text-brand-gold transition-colors" id="map-phone">
                      +91 88753 05442
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Working Hours</div>
                    <div className="text-white text-sm space-y-1">
                      <div>Mon – Sat: <span className="text-brand-gold">5:00 AM – 11:00 PM</span></div>
                      <div>Sunday: <span className="text-brand-gold">6:00 AM – 10:00 PM</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <a
                href={navigationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
                id="get-directions"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>

              <a
                href="tel:+918875305442"
                className="flex items-center justify-center gap-2 w-full border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                id="map-call-button"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>

              <a
                href="https://wa.me/918875305442"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-[#25D366]/20 text-[#25D366] font-medium py-3 rounded-xl hover:bg-[#25D366]/5 transition-colors text-sm"
                id="map-whatsapp-button"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
