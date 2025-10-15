import mongoose from 'mongoose';

export async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

