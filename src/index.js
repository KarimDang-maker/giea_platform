require('dotenv').config();
const express = require('express');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

// Database and Config
const { initializeFirestore } = require('./config/database');
const configurePassport = require('./config/passport');
const swaggerSpec = require('./config/swagger');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Utils
const { rateLimitConfig } = require('./utils/helpers');

// Initialize Express app
const app = express();

// Initialize Firestore
const db = initializeFirestore();

// Configure Passport
configurePassport(passport);

// Middleware - Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware - Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware - Cookie Parser
app.use(cookieParser());

// Middleware - Session (using memory store for development)
// For production, consider using a dedicated session store
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Middleware - Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware - Rate Limiting
const limiter = rateLimit(rateLimitConfig);
app.use('/api/auth/', limiter);

// Response logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/swagger.json',
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GIEA Platform API Docs',
}));

// Swagger JSON endpoint
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GIEA Platform API',
    version: '1.0.0',
    database: 'Firebase Firestore',
    documentation: 'http://localhost:5000/api/docs',
    routes: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Firebase validation error
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(400).json({
      message: 'Firestore error',
      error: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ GIEA Platform server is running on port ${PORT}`);
  console.log(`📊 Database: Firebase Firestore`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`\n`);
});

module.exports = app;
