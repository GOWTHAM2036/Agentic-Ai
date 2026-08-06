const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorMiddleware, notFoundHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Global Middlewares & Security
app.use(helmet());

// CORS must be enabled before rate limiting so 429 responses include CORS headers
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://agentic-ai-five-beryl.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development' || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy restriction'));
    }
  },
  credentials: true
}));

// Rate limiting middleware (configured after CORS and skips OPTIONS preflight)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Ensure OPTIONS requests are never throttled
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AgentFlow AI Multi-Agent Operations Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorMiddleware);

module.exports = app;
