import mongoose, { Document, Schema } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  description?: string
  type: 'percentage' | 'fixed'
  value: number
  maxDiscount?: number // for percentage type
  minPurchase: number
  usageLimit: number
  usedCount: number
  usedBy: {
    member: mongoose.Types.ObjectId
    usedAt: Date
    orderId?: string
  }[]
  applicablePlans: string[] // [] means all plans
  startDate: Date
  endDate: Date
  isActive: boolean
  branch: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, uppercase: true, trim: true, index: true },
    description: String,
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    maxDiscount: Number,
    minPurchase: { type: Number, default: 0 },
    usageLimit: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, default: 0 },
    usedBy: [{
      member: { type: Schema.Types.ObjectId, ref: 'Member' },
      usedAt: { type: Date, default: Date.now },
      orderId: String,
    }],
    applicablePlans: [String],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

CouponSchema.index({ code: 1, branch: 1 }, { unique: true })

/* ─── Virtual: Is valid ─── */
CouponSchema.virtual('isValid').get(function () {
  const now = new Date()
  return (
    this.isActive &&
    this.usedCount < this.usageLimit &&
    this.startDate <= now &&
    this.endDate >= now
  )
})

/* ─── Method: Calculate discount ─── */
CouponSchema.methods.calculateDiscount = function (amount: number): number {
  if (amount < this.minPurchase) return 0
  if (this.type === 'fixed') return Math.min(this.value, amount)
  const discount = (amount * this.value) / 100
  return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount
}

export default mongoose.model<ICoupon>('Coupon', CouponSchema)
