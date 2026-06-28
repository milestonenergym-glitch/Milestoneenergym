import mongoose, { Document, Schema } from 'mongoose'

/**
 * Global gym settings — fully dynamic from Admin Panel.
 * One document per branch.
 */
export interface ISetting extends Document {
  branch: mongoose.Types.ObjectId
  // Gym Info
  gymName: string
  tagline: string
  logo?: string
  favicon?: string
  // Contact
  phone: string[]
  whatsappNumber: string
  email: string[]
  address: string
  city: string
  state: string
  pincode: string
  country: string
  // Working Hours
  workingHours: {
    day: string
    open: string
    close: string
    isClosed: boolean
  }[]
  // Social Media
  social: {
    instagram?: string
    facebook?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
  // Maps & Reviews
  googleMapsUrl?: string
  googleMapsEmbedUrl?: string
  googleReviewUrl?: string
  googlePlaceId?: string
  // SEO
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  // Membership Pricing
  membershipPricing: {
    monthly: number
    quarterly: number
    halfYearly: number
    yearly: number
    corporate?: number
    student?: number
    family?: number
  }
  // GST
  gstEnabled: boolean
  gstRate: number
  gstNumber?: string
  // Notifications
  emailNotifications: boolean
  whatsappNotifications: boolean
  pushNotifications: boolean
  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage?: string
  // Theme
  primaryColor: string
  secondaryColor: string
  // Banner/Hero
  heroImages: string[]
  // Feature flags
  features: {
    aiChatbot: boolean
    onlinePayments: boolean
    qrAttendance: boolean
    loyaltyProgram: boolean
    referralSystem: boolean
  }
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SettingSchema = new Schema<ISetting>(
  {
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, unique: true },
    gymName: { type: String, default: 'Milestone Energym' },
    tagline: { type: String, default: 'Train Hard. Stay Strong.' },
    logo: String,
    favicon: String,
    phone: [String],
    whatsappNumber: { type: String, default: '+918875305442' },
    email: [String],
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    workingHours: [{
      day: String,
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false },
    }],
    social: {
      instagram: String,
      facebook: String,
      youtube: String,
      twitter: String,
      linkedin: String,
    },
    googleMapsUrl: String,
    googleMapsEmbedUrl: String,
    googleReviewUrl: String,
    googlePlaceId: String,
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
    membershipPricing: {
      monthly: { type: Number, default: 1500 },
      quarterly: { type: Number, default: 3999 },
      halfYearly: { type: Number, default: 6999 },
      yearly: { type: Number, default: 11999 },
      corporate: Number,
      student: Number,
      family: Number,
    },
    gstEnabled: { type: Boolean, default: true },
    gstRate: { type: Number, default: 18 },
    gstNumber: String,
    emailNotifications: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: String,
    primaryColor: { type: String, default: '#0F52BA' },
    secondaryColor: { type: String, default: '#D4AF37' },
    heroImages: [String],
    features: {
      aiChatbot: { type: Boolean, default: true },
      onlinePayments: { type: Boolean, default: true },
      qrAttendance: { type: Boolean, default: true },
      loyaltyProgram: { type: Boolean, default: true },
      referralSystem: { type: Boolean, default: true },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model<ISetting>('Setting', SettingSchema)
