/**
 * Shvasa ATM Backend Server
 * 
 * A robust Node.js backend for a Virtual ATM Banking System.
 * Architecture follows a layered approach with proper separation of concerns:
 * - Routes: HTTP request handling
 * - Controllers: Business logic
 * - Services: Core operations
 * - Middleware: Cross-cutting concerns (auth, validation, errors)
 * - Utilities: Helpers
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes and middleware
import atmRoutes from './routes/atmRoutes.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger, performanceLogger } from './middleware/logger.js';
import { sanitizeInput } from './middleware/sanitizer.js';

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'shvasa-atm' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    })
  ]
});

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// ===== Middleware Stack =====

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for demo frontend integration
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Session-ID']
}));

// Rate limiting - prevents brute force attacks on PIN
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 'Please wait before making additional requests.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger(logger));

// Input sanitization
app.use(sanitizeInput);

// Performance monitoring
app.use(performanceLogger());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Shvasa ATM Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static frontend files (check public folder, then root)
app.use(express.static(join(__dirname, 'public')));
app.use(express.static(__dirname));

// API info endpoint
const apiInfoHandler = (req, res) => {
  res.json({
    service: 'Shvasa ATM Backend',
    version: '1.0.0',
    description: 'RESTful API for Virtual ATM Banking System',
    endpoints: {
      health: 'GET /health',
      auth: {
        login: 'POST /api/auth/login',
        verify: 'POST /api/auth/verify'
      },
      account: {
        balance: 'GET /api/account/balance',
        transactions: 'GET /api/account/transactions',
        details: 'GET /api/account/details'
      },
      transactions: {
        withdraw: 'POST /api/transactions/withdraw',
        deposit: 'POST /api/transactions/deposit',
        history: 'GET /api/transactions/history'
      },
      session: {
        start: 'POST /api/session/start',
        end: 'POST /api/session/end'
      },
      system: {
        status: 'GET /api/system/status',
        reset: 'POST /api/system/reset'
      }
    },
    documentation: 'See README.md for full API documentation'
  });
};

app.get('/api', apiInfoHandler);

app.get('/', (req, res, next) => {
  if (req.accepts('html')) {
    return res.sendFile(join(__dirname, 'index.html'));
  }
  return apiInfoHandler(req, res);
});

// Mount API routes
app.use('/api/auth', atmRoutes.auth);
app.use('/api/account', atmRoutes.account);
app.use('/api/transactions', atmRoutes.transactions);
app.use('/api/session', atmRoutes.session);
app.use('/api/system', atmRoutes.system);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Start server (only in standalone mode, not in Vercel serverless)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, HOST, () => {
    logger.info(`🚀 Shvasa ATM Backend running on http://${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`API documentation available at http://${HOST}:${PORT}/`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
    
    // Force shutdown after 10s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions in standalone mode
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

export default app;