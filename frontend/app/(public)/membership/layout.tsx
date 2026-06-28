import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym Membership Plans | Milestone Energym',
  description: 'Flexible fitness and gym membership plans in Barmer. Choose from Monthly, Half-Yearly, and Yearly packages. No hidden fees. Join the best gym near you!',
  alternates: {
    canonical: 'https://milestoneenergym.com/membership',
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I freeze or pause my membership?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, members on the Gold and Platinum plans can freeze their membership for up to 30 days per year without any additional fees. A 7-day notice is required."
      }
    },
    {
      "@type": "Question",
      "name": "Are there any joining fees or hidden charges?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, we believe in complete transparency. The price you see is the price you pay. There are zero hidden registration or cancellation fees."
      }
    },
    {
      "@type": "Question",
      "name": "Can I upgrade my plan later?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! You can upgrade your plan at any time. The price difference will be prorated based on the remaining days in your billing cycle."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer a free trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer a 3-day free trial pass for local residents so you can experience our facilities and classes before committing to a membership."
      }
    }
  ]
}

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
