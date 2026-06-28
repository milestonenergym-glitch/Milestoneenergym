import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

/* ─── User Roles ─── */
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'receptionist'
  | 'trainer'
  | 'nutritionist'
  | 'accountant'
  | 'cleaner'
  | 'member'

/* ─── Role Permissions Map ─── */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'], // All permissions
  admin: [
    'dashboard', 'members', 'leads', 'payments', 'attendance',
    'classes', 'trainers', 'staff', 'expenses', 'coupons',
    'referrals', 'loyalty', 'tasks', 'visitors', 'calendar',
    'blog', 'gallery', 'inventory', 'reports', 'settings', 'notifications',
  ],
  manager: [
    'dashboard', 'members', 'leads', 'payments', 'attendance',
    'classes', 'trainers', 'tasks', 'calendar', 'notifications',
  ],
  receptionist: ['members', 'leads', 'attendance', 'payments', 'visitors'],
  trainer: ['members:read', 'attendance', 'classes', 'calendar'],
  nutritionist: ['members:read', 'diet-plans'],
  accountant: ['payments', 'expenses', 'reports'],
  cleaner: [],
  member: ['member-portal'],
}

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  password?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  googleId?: string
  refreshToken?: string
  passwordHistory: string[]
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  loginAttempts: number
  lockUntil?: Date
  deviceSessions: {
    deviceId: string
    deviceName: string
    ipAddress: string
    lastActive: Date
    userAgent: string
  }[]
  branch?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  isLocked(): boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    passwordHistory: {
      type: [String],
      select: false,
      default: []
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'manager', 'receptionist', 'trainer', 'nutritionist', 'accountant', 'cleaner', 'member'],
      default: 'member',
    },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },
    refreshToken: { type: String, select: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    deviceSessions: [{
      deviceId: String,
      deviceName: String,
      ipAddress: String,
      lastActive: { type: Date, default: Date.now },
      userAgent: String,
    }],
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

/* ─── Indexes ─── */
UserSchema.index({ email: 1 })
UserSchema.index({ phone: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ branch: 1 })

/* ─── Pre-save: Hash password ─── */
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return

  // Store old password in history (max 5)
  if (this.isModified('password')) {
    const pwdHistory = this.passwordHistory || []
    this.passwordHistory = [...pwdHistory.slice(0, 4), this.password] // Keep last 5 passwords
  }

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

/* ─── Methods ─── */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date())
}

export default mongoose.model<IUser>('User', UserSchema)
