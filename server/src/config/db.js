import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    process.env.DATA_STORE = 'memory';
    console.warn('MONGODB_URI is missing, using demo in-memory store.');
    return { mode: 'memory' };
  }

  try {
    const connection = await mongoose.connect(uri);
    process.env.DATA_STORE = 'mongo';
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return { mode: 'mongo' };
  } catch (error) {
    process.env.DATA_STORE = 'memory';
    console.warn(`MongoDB unavailable, using demo in-memory store: ${error.message}`);
    return { mode: 'memory', error };
  }
}
