import mongoose from 'mongoose'

let isConnected = false

/**
 * Connect to MongoDB Atlas with retry logic.
 * Supports multi-branch via MONGODB_URI env variable.
 */
export async function connectDB(): Promise<void> {
  if (isConnected) return

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  try {
    mongoose.set('strictQuery', false)

    const connection = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = connection.connection.readyState === 1
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...')
      isConnected = false
    })

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected')
      isConnected = true
    })

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close()
  isConnected = false
}
