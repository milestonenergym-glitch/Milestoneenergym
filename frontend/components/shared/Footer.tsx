import Link from 'next/link'
import Image from 'next/image'
import {
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Clock,
} from 'lucide-react'
import { getGymSettings } from '@/app/actions/settings'

// Social icon SVG components (since lucide doesn't include brand icons)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props} fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props} fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props} fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Membership Plans', href: '/membership' },
    { label: 'Classes Schedule', href: '/classes' },
    { label: 'Personal Training', href: '/personal-training' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Transformations', href: '/transformations' },
  ],
  fitnessTools: [
    { label: 'BMI Calculator', href: '/bmi-calculator' },
    { label: 'Calories Calculator', href: '/calories-calculator' },
    { label: 'Diet Plans', href: '/diet-plans' },
    { label: 'Blog & Tips', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Testimonials', href: '/testimonials' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Admin Login', href: '/login' },
  ],
  social: [
    { label: 'Instagram', icon: InstagramIcon, key: 'instagramUrl', color: '#E1306C' },
    { label: 'Facebook', icon: FacebookIcon, key: 'facebookUrl', color: '#1877F2' },
    { label: 'YouTube', icon: YoutubeIcon, key: 'youtubeUrl', color: '#FF0000' },
  ],
}

export default async function Footer() {
  const settings = await getGymSettings()
  const currentYear = new Date().getFullYear()

  let parsedHours = []
  try {
    parsedHours = JSON.parse(settings?.businessHours || '[]')
  } catch(e) {
    parsedHours = []
  }

  return (
    <footer className="relative bg-[#080808] border-t border-white/8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Newsletter / CTA Banner */}
      <div className="border-b border-white/8">
        <div className="container-custom py-12">
          <div className="glass rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Start Your Fitness Journey Today
              </h3>
              <p className="text-white/60">
                Join 2,000+ members transforming their lives at Milestone Energym.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/#free-trial"
                className="btn-primary py-3 px-6"
                id="footer-free-trial-cta"
              >
                Book Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${settings?.contactPhone?.replace(/[^0-9]/g, '') || '918875305442'}?text=Hi%20Milestone%20Energym!%20I%27m%20interested%20in%20joining%20the%20gym.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold py-3 px-6"
                id="footer-whatsapp-cta"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="Milestone Energym Home">
              <div className="relative w-20 h-20">
                <Image src="/logo.jpg" alt="Milestone Energym" fill className="object-contain" />
              </div>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Premium fitness center designed to help you reach your peak performance. Train harder, recover smarter, and transform completely.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <span className="text-white/70 text-sm font-medium">4.8 on Google</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {footerLinks.social.map(({ label, icon: Icon, key, color }) => {
                const href = settings?.[key as keyof typeof settings] as string
                if (!href) return null
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/50 hover:text-white transition-all hover:-translate-y-0.5"
                    aria-label={`Follow on ${label}`}
                    id={`footer-social-${label.toLowerCase().replace(/[\s/]+/g, '-')}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/50 text-sm hover:text-brand-gold transition-colors hover-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fitness Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Fitness Tools</h4>
            <ul className="space-y-3">
              {footerLinks.fitnessTools.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/50 text-sm hover:text-brand-gold transition-colors hover-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="flex flex-col gap-4">
                <a href={settings?.googleMapsUrl || '#'} className="text-white/70 hover:text-white hover:-translate-y-0.5 transition-all flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <span className="text-sm">{settings?.address}</span>
                </a>
                <a href={`tel:${settings?.contactPhone}`} className="text-white/70 hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <span className="text-sm">{settings?.contactPhone}</span>
                </a>
                <a href={`mailto:${settings?.contactEmail}`} className="text-white/70 hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <span className="text-sm">{settings?.contactEmail}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 pt-2">
                <Clock className="w-4 h-4 text-brand-blue-300 flex-shrink-0 mt-0.5" />
                <ul className="space-y-3 w-full">
                  {parsedHours.map((hours: any, index: number) => (
                    <li key={index} className="flex justify-between items-center text-white/70 text-sm">
                      <span>{hours.day}</span>
                      <span className="text-white font-medium">{hours.time}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>© {currentYear} Milestone Energym. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1 text-white/20 text-xs">
            <span>Crafted with</span>
            <span className="text-brand-gold">♥</span>
            <span>for fitness excellence</span>
          </div>

          <div className="flex items-center gap-4">
            {footerLinks.legal.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
