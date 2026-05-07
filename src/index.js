require('dotenv').config();
const express = require('express');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const marketplaceRoutes = require('./modules/marketplace/routes');

// Database and Config
const { initializeFirestore } = require('./config/database');
const configurePassport = require('./config/passport');
const swaggerSpec = require('./config/swagger');

// Initialize Firestore (Must be called before importing routes)
const db = initializeFirestore();

// Routes - Modules
const { authRoutes, userRoutes } = require('./modules/authentication/routes');
const { projetRoutes } = require('./modules/gestion_projets/routes')
const { categoryRoutes } = require('./modules/categories');
const { notificationRoutes } = require('./modules/notifications');
const { statisticsRoutes, reportRoutes } = require('./modules/report/routes');
const { dashboardRoutes, activityRoutes, recommendationRoutes } = require('./modules/dashboard/routes');
const eventRoutes = require('./modules/events/routes/event.routes');

// Utils
const { rateLimitConfig } = require('./utils/helpers');

// Initialize Express app
const app = express();

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

// Middleware - Static Files (Public folder)
app.use(express.static('src/public'));

// Response logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Auth Callback Route - Serve HTML page for OAuth callbacks
app.get('/auth-callback', (req, res) => {
  res.sendFile('public/auth-callback.html', { root: __dirname });
});

// Reset Password Route - Serve reset password form
app.get('/reset-password.html', (req, res) => {
  res.sendFile('public/reset-password.html', { root: __dirname });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/swagger.json',
  },
  customSiteTitle: 'GIEA Platform API Docs',
}));

// Swagger JSON endpoint
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/marketPlace', marketplaceRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 

//Routes pour la gestion des projets
app.use('/api/projet', projetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Statistics and Reporting Routes (Admin Only)
app.use('/api/statistics', statisticsRoutes);
app.use('/api/reports', reportRoutes);

// Dashboard Routes (Authenticated Users)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard/activities', activityRoutes);
app.use('/api/dashboard/recommendations', recommendationRoutes);
app.use('/api/events', eventRoutes);

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
      categories: '/api/categories',
      health: '/health',
      projet: '/api/projet',
      notifications: '/api/notifications',
      statistics: '/api/statistics (admin only)',
      reports: '/api/reports (admin only)',
      dashboard: '/api/dashboard (authenticated users)',
      activities: '/api/dashboard/activities (authenticated users)',
      recommendations: '/api/dashboard/recommendations (authenticated users)'
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

// Start Notification Worker
require('./modules/notifications/services/worker.service');
console.log('👷 Notification Worker started');

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
