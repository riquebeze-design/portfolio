import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import workRoutes from './routes/work.routes';
import leadRoutes from './routes/lead.routes';
import adminRoutes from './routes/admin.routes';
// A autenticação será gerenciada pelo Supabase, então removemos o middleware de autenticação local.
// import { authenticateToken } from './middleware/auth.middleware';
// O seeding de admin será feito manualmente ou via Supabase Auth, não mais no startup do Express.
// import { seedAdminUser } from '../prisma/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Não precisamos mais semear o admin aqui, o Supabase Auth cuidará disso.
// seedAdminUser();

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

// Não precisamos mais de rate limiting aqui, o Supabase tem o seu próprio.
// const publicRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message: 'Too many requests from this IP, please try again after 15 minutes',
// });

// Não serviremos mais arquivos estáticos de uploads localmente, usaremos Supabase Storage.
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Public routes
app.use('/api/works', workRoutes); // Removido publicRateLimiter
app.use('/api/leads', leadRoutes); // Removido publicRateLimiter

// Admin routes (protected) - A proteção será feita no frontend ou via RLS no Supabase
// Por enquanto, removemos o middleware authenticateToken aqui.
app.use('/api/admin', adminRoutes); // Removido authenticateToken

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Frontend URL for CORS: ${frontendUrl}`);
});