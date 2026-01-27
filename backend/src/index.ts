import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import authRoutes from './routes/auth.routes';
import workRoutes from './routes/work.routes';
import leadRoutes from './routes/lead.routes';
import adminRoutes from './routes/admin.routes';
import { authenticateToken } from './middleware/auth.middleware';
import { seedAdminUser } from '../prisma/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Seed initial admin user on startup
seedAdminUser();

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
const corsOptions = {
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate limiting for public routes
const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Public routes
app.use('/api/auth', publicRateLimiter, authRoutes);
app.use('/api/works', publicRateLimiter, workRoutes);
app.use('/api/leads', publicRateLimiter, leadRoutes);

// Admin routes (protected)
app.use('/api/admin', authenticateToken, adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Frontend URL for CORS: ${frontendUrl}`);
});