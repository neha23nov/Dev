import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes.js';
import gigRoutes from './routes/gig.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import messageRoutes from './routes/message.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── CORS — must be absolute first ──────────────────────────
const corsOptions = {
  origin: '*',   // temporarily allow ALL origins to confirm CORS works
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// ── Security ───────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false, // important — don't let helmet override CORS
}));

// ── Rate limit ─────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ── Body parsing ───────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'DevHire API is running', time: new Date() });
});

// ── Global error handler ───────────────────────────────────
app.use(errorHandler);

export default app;