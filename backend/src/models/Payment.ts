import mongoose, { Document, Schema } from 'mongoose'

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'wallet' | 'cheque'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially-refunded'
export type PaymentPurpose = 'membership' | 'personal-training' | 'supplement' | 'merchandise' | 'day-pass' | 'other'

export interface IPayment extends Document {
  invoiceNumber: string
  member?: mongoose.Types.ObjectId
  visitor?: mongoose.Types.ObjectId
  purpose: PaymentPurpose
  description: string
  amount: number
  discountAmount: number
  gstRate: number
  gstAmount: number
  totalAmount: number
  method: PaymentMethod
  status: PaymentStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  upiTransactionId?: string
  refundAmount?: number
  refundReason?: string
  refundedAt?: Date
  paidAt?: Date
  membership?: mongoose.Types.ObjectId
  collectedBy?: mongoose.Types.ObjectId
  branch: mongoose.Types.ObjectId
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    member: { type: Schema.Types.ObjectId, ref: 'Member', index: true },
    visitor: { type: Schema.Types.ObjectId, ref: 'Visitor' },
    purpose: {
      type: String,
      required: true,
      enum: ['membership', 'personal-training', 'supplement', 'merchandise', 'day-pass', 'other'],
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    gstRate: { type: Number, default: 18 },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      required: true,
      enum: ['cash', 'upi', 'card', 'online', 'wallet', 'cheque'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    upiTransactionId: { type: String },
    refundAmount: { type: Number },
    refundReason: { type: String },
    refundedAt: { type: Date },
    paidAt: { type: Date },
    membership: { type: Schema.Types.ObjectId, ref: 'Membership' },
    collectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    notes: { type: String },
  },
  { timestamps: true }
)

PaymentSchema.index({ invoiceNumber: 1 })
PaymentSchema.index({ member: 1, createdAt: -1 })
PaymentSchema.index({ branch: 1, status: 1, createdAt: -1 })
PaymentSchema.index({ razorpayOrderId: 1 })

/* ─── Pre-save: Auto-generate invoice number ─── */
PaymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model('Payment').countDocuments({ branch: this.branch })
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`
  }
  next()
})

export default mongoose.model<IPayment>('Payment', PaymentSchema)
