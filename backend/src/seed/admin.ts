import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User'
import Setting from '../models/Setting'

dotenv.config()

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) throw new Error('MONGODB_URI is not defined in .env')

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    // Generate a default branch ID if Settings don't exist
    const defaultBranchId = new mongoose.Types.ObjectId()
    
    // Create Default Setting if doesn't exist
    let settings = await Setting.findOne()
    if (!settings) {
      settings = await Setting.create({
        branch: defaultBranchId,
        gymName: 'Milestone Energym',
        tagline: 'Train Hard. Stay Strong.',
        phone: ['+918875305442'],
        whatsappNumber: '+918875305442',
        email: ['admin@milestoneenergym.com'],
        address: 'Milestone Energym',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        country: 'India'
      })
      console.log('✅ Created default gym settings')
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ phone: '8875305442' })
    
    if (adminExists) {
      console.log('⚠️ Admin with phone 8875305442 already exists. Updating password...')
      adminExists.password = '8875305442' // Will be hashed by pre-save hook
      adminExists.role = 'admin'
      await adminExists.save()
      console.log('✅ Admin password reset successfully.')
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@milestoneenergym.com',
        phone: '8875305442',
        password: '8875305442',
        role: 'admin',
        branch: defaultBranchId,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        loginAttempts: 0,
        twoFactorEnabled: false
      })
      console.log('✅ Admin account created successfully.')
    }

    console.log('\n--- Admin Credentials ---')
    console.log('Email: admin@milestoneenergym.com')
    console.log('Phone: 8875305442')
    console.log('Password: 8875305442')
    console.log('-------------------------\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
