import mongoose, { Document, Schema } from 'mongoose'

export interface IAttendance extends Document {
  member: mongoose.Types.ObjectId
  date: Date
  checkIn: Date
  checkOut?: Date
  duration?: number // minutes
  method: 'qr' | 'manual' | 'rfid'
  markedBy?: mongoose.Types.ObjectId
  notes?: string
  branch: mongoose.Types.ObjectId
  createdAt: Date
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    date: { type: Date, required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    duration: { type: Number }, // auto-calculated
    method: { type: String, enum: ['qr', 'manual', 'rfid'], default: 'manual' },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  },
  { timestamps: true }
)

AttendanceSchema.index({ member: 1, date: 1 }, { unique: true })
AttendanceSchema.index({ branch: 1, date: -1 })

/* ─── Calculate duration on checkout ─── */
AttendanceSchema.pre('save', function (next) {
  if (this.checkOut && this.checkIn) {
    this.duration = Math.round((this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60))
  }
  next()
})

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema)
