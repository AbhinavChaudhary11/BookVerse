import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';

// route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import bookRoutes from './routes/bookRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately to allow health checks even if DB is down
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously; log errors but don't crash server
connectDb().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to connect to database', err);
});

export default app;

