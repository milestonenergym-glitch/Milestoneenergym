import mongoose, { Document, Schema } from 'mongoose'

export interface IMember extends Document {
  user: mongoose.Types.ObjectId
  memberId: string // e.g. ME-2024-0001
  name: string
  phone: string
  email?: string
  dateOfBirth?: Date
  gender: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  photo?: string
  goal?: string
  medicalConditions?: string[]
  bloodGroup?: string
  height?: number // cm
  weight?: number // kg
  currentMembership?: mongoose.Types.ObjectId
  trainer?: mongoose.Types.ObjectId
  nutritionist?: mongoose.Types.ObjectId
  referredBy?: mongoose.Types.ObjectId
  referralCode: string
  loyaltyPoints: number
  walletBalance: number
  qrCode?: string // base64 QR for attendance
  joinDate: Date
  lastAttendance?: Date
  totalAttendances: number
  isActive: boolean
  tags: string[]
  branch: mongoose.Types.ObjectId
  measurements: {
    date: Date
    weight: number
    height: number
    chest?: number
    waist?: number
    hips?: number
    bicep?: number
    thigh?: number
    bodyFatPercentage?: number
  }[]
  progressPhotos: {
    date: Date
    before?: string
    after?: string
    caption?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const MemberSchema = new Schema<IMember>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    memberId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, trim: true },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    photo: { type: String },
    goal: { type: String },
    medicalConditions: [String],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    height: { type: Number, min: 50, max: 300 },
    weight: { type: Number, min: 20, max: 500 },
    currentMembership: { type: Schema.Types.ObjectId, ref: 'Membership' },
    trainer: { type: Schema.Types.ObjectId, ref: 'User' },
    nutritionist: { type: Schema.Types.ObjectId, ref: 'User' },
    referredBy: { type: Schema.Types.ObjectId, ref: 'Member' },
    referralCode: { type: String, required: true, unique: true },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    walletBalance: { type: Number, default: 0, min: 0 },
    qrCode: { type: String },
    joinDate: { type: Date, default: Date.now },
    lastAttendance: { type: Date },
    totalAttendances: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    measurements: [{
      date: { type: Date, default: Date.now },
      weight: Number,
      height: Number,
      chest: Number,
      waist: Number,
      hips: Number,
      bicep: Number,
      thigh: Number,
      bodyFatPercentage: Number,
    }],
    progressPhotos: [{
      date: { type: Date, default: Date.now },
      before: String,
      after: String,
      caption: String,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

/* ─── Indexes ─── */
MemberSchema.index({ memberId: 1 })
MemberSchema.index({ phone: 1 })
MemberSchema.index({ referralCode: 1 })
MemberSchema.index({ branch: 1, isActive: 1 })
MemberSchema.index({ currentMembership: 1 })

/* ─── Virtual: BMI ─── */
MemberSchema.virtual('bmi').get(function () {
  if (this.height && this.weight) {
    const h = this.height / 100
    return Math.round((this.weight / (h * h)) * 10) / 10
  }
  return null
})

/* ─── Virtual: Age ─── */
MemberSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null
  const today = new Date()
  const birth = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
})

/* ─── Pre-save: Auto-generate member ID ─── */
MemberSchema.pre('save', async function (next) {
  if (this.isNew && !this.memberId) {
    const count = await mongoose.model('Member').countDocuments({ branch: this.branch })
    const year = new Date().getFullYear()
    this.memberId = `ME-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export default mongoose.model<IMember>('Member', MemberSchema)
