import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import missionRoutes from './routes/mission.routes';
import contactRoutes from './routes/contact.routes';
import membershipRoutes from './routes/membership.routes';
import newsRoutes from './routes/news.routes';
import pressReleaseRoutes from './routes/press-release.routes';
import uploadRoutes from './routes/upload.routes';
import mediaRoutes from './routes/media.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { validateEnv } from './lib/env';

// Load and validate environment variables
dotenv.config();
const env = validateEnv();

const app: Application = express();
const PORT = env.PORT || 5000;

// CORS Middleware (MUST be before helmet)
app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false // Allow embedding from cross-origin
}));

// General Rate Limiting for all API routes
app.use('/api/', generalLimiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger Middleware
app.use(logger);

// Serve static files from uploads directory (ONLY for mission-representatives, not media)
// Media files are served through authenticated API endpoint for security
app.use('/uploads/mission-representatives', express.static(path.join(__dirname, '../uploads/mission-representatives')));

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Madhesh Mahasabha Backend API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mission-representatives', missionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🚀 Madhesh Mahasabha Backend API                     ║
║                                                           ║
║     Environment: ${(env.NODE_ENV || 'development').padEnd(32)} ║
║     Port: ${PORT.toString().padEnd(47)} ║
║     URL: http://localhost:${PORT}                          ║
║                                                           ║
║     Status: ✅ Server is running                         ║
║     Security: ✅ Environment validated                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
