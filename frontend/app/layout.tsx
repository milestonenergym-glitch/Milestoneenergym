import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import CookieBanner from '@/components/shared/CookieBanner'
import LeadCapturePopup from '@/components/shared/LeadCapturePopup'
import OccasionPopup from '@/components/shared/OccasionPopup'
import { Providers } from '@/components/Providers'
import { getGymSettings } from '@/app/actions/settings'

/* ─── Fonts ─── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

/* ─── Site Metadata ─── */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://milestoneenergym.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Milestone Energym — Train Hard. Stay Strong.',
    template: '%s | Milestone Energym',
  },
  description:
    'Milestone Energym is a premium fitness center offering state-of-the-art equipment, certified trainers, CrossFit, Yoga, Personal Training, and flexible memberships. Join today and transform your body.',
  keywords: [
    'gym',
    'fitness center',
    'Milestone Energym',
    'personal training',
    'CrossFit',
    'yoga',
    'membership',
    'weight training',
    'cardio',
    'certified trainers',
    'gym near me',
  ],
  authors: [{ name: 'Milestone Energym' }],
  creator: 'Milestone Energym',
  publisher: 'Milestone Energym',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Milestone Energym',
    title: 'Milestone Energym — Train Hard. Stay Strong.',
    description:
      'Premium fitness center with certified trainers, imported machines, CrossFit, Yoga & Personal Training. Join Milestone Energym today!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Milestone Energym — Premium Fitness Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milestone Energym — Train Hard. Stay Strong.',
    description: 'Premium fitness center with certified trainers, imported machines & flexible memberships.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'fitness',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0F52BA' }],
  },
  other: {
    'msapplication-TileColor': '#0F52BA',
    'theme-color': '#0A0A0A',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

/* ─── Schema.org Structured Data ─── */
const schemaOrgData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Milestone Energym',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Milestone Energym',
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    sameAs: [
      'https://www.instagram.com/milestoneenergym',
      'https://www.facebook.com/milestoneenergym',
      'https://www.youtube.com/@milestoneenergym',
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': ['GymOrSportsClub', 'LocalBusiness'],
    name: 'Milestone Energym',
    description: 'Premium fitness center offering certified training, imported equipment, CrossFit, Yoga & Personal Training in Barmer.',
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: '+91-8875305442',
    email: 'Milestonenergym@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'नवलाराम की चक्की, Near Crown Plaza NH68 जैसलमेर रोड बाड़मेर',
      addressLocality: 'Barmer',
      addressRegion: 'Rajasthan',
      postalCode: '344001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.7532',
      longitude: '71.4031',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '05:30',
        closes: '22:30',
      },
    ],
    priceRange: '₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
    }
  }
]

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getGymSettings()
  const gaId = settings?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || ''
  const pixelId = settings?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || ''

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-white dark:bg-[#0A0A0A] text-black dark:text-white transition-colors duration-300">
        {/* Analytics */}
        <GoogleAnalytics gaId={gaId} />
        <MetaPixel pixelId={pixelId} />

        {/* App Providers */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <Providers>
              {children}
              <LeadCapturePopup />
              <OccasionPopup />
            </Providers>
            <Toaster
              position="top-right"
              theme="dark"
              richColors
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                },
              }}
            />
            <CookieBanner />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
