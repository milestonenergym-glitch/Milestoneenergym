import mongoose, { Document, Schema } from 'mongoose'

export type LeadSource =
  | 'website'
  | 'walk-in'
  | 'phone'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'google'
  | 'referral'
  | 'corporate'
  | 'offline'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'trial'
  | 'joined'
  | 'lost'
  | 'expired'

export interface ILead extends Document {
  name: string
  phone: string
  email?: string
  address?: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  goal?: string
  preferredTime?: string
  source: LeadSource
  status: LeadStatus
  remarks?: string
  followUpDate?: Date
  followUpHistory: {
    date: Date
    note: string
    by: mongoose.Types.ObjectId
    status: LeadStatus
  }[]
  assignedTo?: mongoose.Types.ObjectId
  convertedToMember?: mongoose.Types.ObjectId
  convertedAt?: Date
  message?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  branch: mongoose.Types.ObjectId
  createdBy?: mongoose.Types.ObjectId
  tags: string[]
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    age: { type: Number, min: 10, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    goal: { type: String, trim: true },
    preferredTime: { type: String },
    source: {
      type: String,
      required: true,
      enum: ['website', 'walk-in', 'phone', 'whatsapp', 'facebook', 'instagram', 'google', 'referral', 'corporate', 'offline'],
      default: 'website',
    },
    status: {
      type: String,
      required: true,
      enum: ['new', 'contacted', 'interested', 'trial', 'joined', 'lost', 'expired'],
      default: 'new',
      index: true,
    },
    remarks: { type: String, trim: true },
    followUpDate: { type: Date },
    followUpHistory: [{
      date: { type: Date, default: Date.now },
      note: String,
      by: { type: Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['new', 'contacted', 'interested', 'trial', 'joined', 'lost', 'expired'] },
    }],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    convertedToMember: { type: Schema.Types.ObjectId, ref: 'Member' },
    convertedAt: { type: Date },
    message: { type: String, trim: true },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

LeadSchema.index({ phone: 1, branch: 1 })
LeadSchema.index({ status: 1, branch: 1 })
LeadSchema.index({ source: 1 })
LeadSchema.index({ followUpDate: 1 })
LeadSchema.index({ createdAt: -1 })

export default mongoose.model<ILead>('Lead', LeadSchema)
