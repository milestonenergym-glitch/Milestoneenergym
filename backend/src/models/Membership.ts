import mongoose, { Document, Schema } from 'mongoose'

export type MembershipPlan =
  | 'monthly'
  | 'quarterly'
  | 'half-yearly'
  | 'yearly'
  | 'corporate'
  | 'student'
  | 'family'

export type MembershipStatus =
  | 'active'
  | 'expired'
  | 'frozen'
  | 'cancelled'
  | 'pending'

export interface IMembership extends Document {
  member: mongoose.Types.ObjectId
  plan: MembershipPlan
  startDate: Date
  endDate: Date
  status: MembershipStatus
  price: number
  discountAmount: number
  gstAmount: number
  totalAmount: number
  couponCode?: string
  couponDiscount?: number
  payment: mongoose.Types.ObjectId
  autoRenew: boolean
  frozenFrom?: Date
  frozenUntil?: Date
  frozenDaysUsed: number
  maxFreezeDays: number
  renewalHistory: {
    renewedAt: Date
    plan: MembershipPlan
    amount: number
    payment: mongoose.Types.ObjectId
  }[]
  remindersSent: {
    days: number
    sentAt: Date
    channel: 'email' | 'whatsapp' | 'push'
  }[]
  branch: mongoose.Types.ObjectId
  createdBy?: mongoose.Types.ObjectId
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const MembershipSchema = new Schema<IMembership>(
  {
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    plan: {
      type: String,
      required: true,
      enum: ['monthly', 'quarterly', 'half-yearly', 'yearly', 'corporate', 'student', 'family'],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'frozen', 'cancelled', 'pending'],
      default: 'active',
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    gstAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    autoRenew: { type: Boolean, default: false },
    frozenFrom: { type: Date },
    frozenUntil: { type: Date },
    frozenDaysUsed: { type: Number, default: 0 },
    maxFreezeDays: { type: Number, default: 30 },
    renewalHistory: [{
      renewedAt: Date,
      plan: String,
      amount: Number,
      payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    }],
    remindersSent: [{
      days: Number,
      sentAt: Date,
      channel: { type: String, enum: ['email', 'whatsapp', 'push'] },
    }],
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
)

MembershipSchema.index({ member: 1, status: 1 })
MembershipSchema.index({ endDate: 1, status: 1 })
MembershipSchema.index({ branch: 1, status: 1 })

/* ─── Virtual: days remaining ─── */
MembershipSchema.virtual('daysRemaining').get(function () {
  if (this.status !== 'active') return 0
  const diff = this.endDate.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

export default mongoose.model<IMembership>('Membership', MembershipSchema)
