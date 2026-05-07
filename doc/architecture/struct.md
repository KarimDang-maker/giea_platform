# GIEA Platform - Complete Structure & Implementation Guide

**Version**: 1.0.0  
**Purpose**: Multi-role economic activities management platform with secure authentication  
**Platform**: Node.js + Express.js + Firebase Firestore

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Architecture Pattern](#architecture-pattern)
5. [Layer-by-Layer Implementation](#layer-by-layer-implementation)
6. [Data Models](#data-models)
7. [Database Schema](#database-schema)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Authentication & Authorization Flow](#authentication--authorization-flow)
10. [API Endpoints](#api-endpoints)
11. [Key Features](#key-features)
12. [Security Implementation](#security-implementation)

---

## 🎯 Project Overview

**GIEA Platform** is a **Groupement d'Intérêt Économique Africain** management system providing:

- ✅ Multi-role user management (6 roles)
- ✅ Secure JWT + OAuth authentication
- ✅ Email verification & password reset
- ✅ Role-based access control (RBAC)
- ✅ File upload to Firebase Storage
- ✅ RESTful API with Swagger documentation
- ✅ Rate limiting & security headers
- ✅ Firebase Firestore as primary database

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | v14+ |
| **Framework** | Express.js | v5.2.1 |
| **Database** | Firebase Firestore | NoSQL |
| **File Storage** | Firebase Storage | Cloud storage |
| **Authentication** | Passport.js | v0.7.0 |
| **JWT** | jsonwebtoken | v9.0.3 |
| **Password Hashing** | bcryptjs | v3.0.3 |
| **Authorization** | CASL/ability | v6.8.0 |
| **Email Service** | Nodemailer | v8.0.4 |
| **File Upload** | Multer | v2.1.1 |
| **Security** | Helmet.js | v8.1.0 |
| **Rate Limiting** | express-rate-limit | v8.3.2 |
| **API Documentation** | Swagger/OpenAPI | v6.2.8 |
| **CORS** | cors | v2.8.6 |
| **Session Management** | express-session | v1.19.0 |
| **Validation** | express-validator | v7.3.2 |
| **Social Auth** | passport-google-oauth20<br/>passport-facebook<br/>passport-local | v2.0.0<br/>v3.0.0<br/>v1.0.0 |

---

## 📁 Directory Structure

```
giea_platform/
│
├── src/                                    # Source code
│   ├── index.js                           # 🚀 Application entry point
│   │
│   ├── config/                            # Configuration files
│   │   ├── database.js                    # Firebase Firestore initialization
│   │   ├── passport.js                    # Passport strategies setup (Local, Google, Facebook)
│   │   ├── swagger.js                     # Swagger/OpenAPI documentation config
│   │   └── multer.js                      # File upload middleware configuration
│   │
│   ├── modules/                           # Feature modules (scalable structure)
│   │   └── authentication/                # Authentication module (currently only module)
│   │       │
│   │       ├── models/                    # Data models (data-only, no DB ops)
│   │       │   ├── index.js               # Model exports
│   │       │   └── user.model.js          # User data structure & methods
│   │       │
│   │       ├── repositories/              # Data access layer (DB operations)
│   │       │   ├── index.js               # Repository exports
│   │       │   └── user.repository.js     # User CRUD operations
│   │       │
│   │       ├── services/                  # Business logic layer
│   │       │   ├── index.js               # Service exports
│   │       │   ├── auth.service.js        # Authentication orchestration logic
│   │       │   ├── user.service.js        # User profile business logic
│   │       │   ├── email.service.js       # Email sending service
│   │       │   └── token.service.js       # JWT token operations
│   │       │
│   │       ├── controllers/               # HTTP request handlers
│   │       │   ├── index.js               # Controller exports
│   │       │   ├── auth.controller.js     # Auth endpoint handlers
│   │       │   └── user.controller.js     # User endpoint handlers
│   │       │
│   │       ├── routes/                    # API route definitions
│   │       │   ├── index.js               # Route exports (aggregates all routes)
│   │       │   ├── auth.routes.js         # Authentication endpoints
│   │       │   └── user.routes.js         # User management endpoints
│   │       │
│   │       ├── middleware/                # Route middleware (auth, permissions)
│   │       │   ├── index.js               # Middleware exports
│   │       │   ├── auth.middleware.js     # JWT verification middleware
│   │       │   └── role.middleware.js     # Role-based access control (CASL)
│   │       │
│   │       ├── utils/                     # Module-specific utilities
│   │       │   └── validators.js          # Input validation rules (express-validator)
│   │       │
│   │       └── index.js                   # Module entry point & exports
│   │
│   ├── public/                            # Static files & static assets
│   │   ├── auth-callback.html             # OAuth callback page template
│   │   ├── auth-callback.js               # OAuth callback script
│   │   └── swagger-theme-toggle.js        # Swagger UI theme switcher
│   │
│   └── utils/                             # Global utilities (used by all modules)
│       └── helpers.js                     # Shared helper functions & configs
│
├── test/                                  # Test scripts
│   ├── manual-test.ps1                    # PowerShell manual test script
│   ├── quick-test.ps1                     # PowerShell quick test script
│   └── run-test.ps1                       # PowerShell automated test runner
│
├── doc/                                   # Documentation (this file included)
│   ├── struct.md                          # 📄 THIS FILE - Architecture overview
│   ├── ARCHITECTURE_GUIDE.md              # Detailed architecture documentation
│   ├── API_SPECIFICATION.md               # Complete API specification
│   ├── API_TESTING_GUIDE.md               # Testing guidelines
│   ├── MODULE_DEVELOPMENT_GUIDE.md        # How to add new modules
│   └── [Other documentation files]
│
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore rules
├── package.json                           # npm dependencies & scripts
├── package-lock.json                      # Locked dependency versions
└── README.md                              # Project README

```

---

## 🏗️ Architecture Pattern

### The Problem with Traditional Active Record

```
❌ TRADITIONAL ACTIVE RECORD (Anti-pattern)
┌─────────────────────────────────────────┐
│ Controller (Thin)                       │
│  ├─ req/res handling                    │
│  └─ Calls Model directly                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Model (Fat - God object)                │
│  ├─ Data properties                     │
│  ├─ save() - DB write                   │
│  ├─ update() - DB update                │
│  ├─ delete() - DB delete                │
│  ├─ find() - DB query                   │
│  ├─ findById() - DB query               │
│  └─ Business logic mixed in             │ ❌ MIXED CONCERNS
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Database                                │
└─────────────────────────────────────────┘

Problems:
- Model has TOO MANY responsibilities
- Hard to test (tightly coupled to DB)
- Not reusable across services
- Difficult to swap implementations
- Unclear data flow
```

### ✅ GIEA Platform: Repository Pattern

```
✅ REPOSITORY PATTERN (What GIEA uses)

┌──────────────────────────────────────────────────────┐
│ HTTP Request                                         │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│ CONTROLLER (Thin)                                    │
│  ├─ Parse request parameters                        │
│  ├─ Call Service                                    │
│  ├─ Format HTTP response                            │
│  └─ Handle request/response only                    │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│ SERVICE (Business Logic Orchestration)               │
│  ├─ Calls Repository for data                       │
│  ├─ Calls EmailService for emails                   │
│  ├─ Calls TokenService for tokens                   │
│  ├─ Orchestrates complex workflows                  │
│  ├─ Validation & business rules                     │
│  └─ Non-HTTP reusable logic                         │
└──┬──────────────┬──────────────────┬────────────────┘
   │              │                  │
   │              │                  │
┌──▼────┐  ┌─────▼─────┐  ┌────────▼────┐
│REPOSI  │  │EMAIL      │  │TOKEN        │
│TORY    │  │SERVICE    │  │SERVICE      │
│(Data)  │  │(Notify)   │  │(Auth)       │
└──┬────┘  └────┬──────┘  └────┬────────┘
   │            │              │
┌──▼────────────▼──────────────▼────┐
│ MODEL (Data-Only)                  │
│  ├─ Properties only                │
│  ├─ Utility methods (getPublic())  │
│  └─ NO DATABASE OPERATIONS         │
└──┬────────────────────────────────┘
   │
┌──▼────────────────────────────────┐
│ FIREBASE FIRESTORE                │
│ (Data Persistence)                │
└───────────────────────────────────┘

Benefits:
✅ Separation of concerns (each layer = ONE responsibility)
✅ Easy to test (each layer independently testable)
✅ Reusable services (can use in API, cron jobs, workers)
✅ Flexible (easy to swap implementations)
✅ Clear data flow (request → controller → service → repo → DB)
✅ Maintainable (easy to find and modify code)
```

---

## 📚 Layer-by-Layer Implementation

### 1️⃣ **MODEL LAYER** - `models/user.model.js`

**Purpose**: Pure data representation  
**Responsibility**: Store user data & provide utility methods  
**Key Rule**: ⛔ NO database operations

```javascript
// ✅ DO - Pure data storage
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'student';
    // ... other properties
  }

  // ✅ DO - Utility methods (no DB)
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  getPublicProfile() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      // Exclude sensitive data
    };
  }
}

// ❌ DON'T - Database operations in model
// Never do: async save() { db.collection.insert(...) }
// Never do: async findById(id) { db.collection.findOne(...) }
```

**User Data Structure**:

```javascript
{
  // Identity
  id: 'user@email.com',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@email.com',
  password: '$2a$10$...(hashed)',
  
  // Contact
  phone: '+1234567890',
  avatar: 'gs://bucket/avatar.jpg',
  
  // Role & Permissions
  role: 'entrepreneur',  // Values: student|entrepreneur|company|investor|mentor|admin
  
  // Verification
  isVerified: true,
  emailVerifiedAt: Timestamp(2024-01-15),
  phoneVerifiedAt: null,
  
  // OAuth IDs
  googleId: 'google_id_123',
  facebookId: null,
  
  // Profile
  profile: {
    bio: 'Founder of startup X',
    company: 'Startup X',
    location: 'Dakar, Senegal',
    website: 'www.startupx.com',
    specialization: 'Tech Startup',
    yearsOfExperience: 5
  },
  
  // Skills & Documents
  skills: ['JavaScript', 'Python', 'Business Strategy'],
  documents: ['resume.pdf', 'pitch_deck.pdf'],
  
  // Preferences
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    privateProfile: false
  },
  
  // Security
  resetPasswordToken: 'hashed_token',
  resetPasswordExpire: Timestamp(2024-01-22),
  emailVerificationToken: 'hashed_token',
  emailVerificationExpire: Timestamp(2024-01-22),
  
  // Activity
  lastLogin: Timestamp(2024-01-15 10:30:00),
  isActive: true,
  
  // System
  firebaseStoragePath: 'gs://bucket/users/user@email.com/',
  createdAt: Timestamp(2024-01-01),
  updatedAt: Timestamp(2024-01-15)
}
```

---

### 2️⃣ **REPOSITORY LAYER** - `repositories/user.repository.js`

**Purpose**: All database operations  
**Responsibility**: CRUD operations on Firestore  
**Key Rule**: ⛔ NO business logic, ONLY data persistence

```javascript
class UserRepository {
  // CREATE
  async create(user) {
    // Hash password
    await user.hashPassword();
    
    // Save to Firestore
    const db = admin.firestore();
    const userRef = db.collection('users').doc(user.email);
    await userRef.set(firestoreData);
    
    return user;
  }

  // READ
  async findByEmail(email) {
    const db = admin.firestore();
    const doc = await db.collection('users').doc(email).get();
    return doc.exists ? new User(doc.data()) : null;
  }

  async findByGoogleId(googleId) {
    const db = admin.firestore();
    const snapshot = await db
      .collection('users')
      .where('googleId', '==', googleId)
      .limit(1)
      .get();
    
    return snapshot.empty ? null : new User(snapshot.docs[0].data());
  }

  // UPDATE
  async update(email, updateData) {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(email);
    
    updateData.updatedAt = new Date();
    await userRef.update(updateData);
    
    const doc = await userRef.get();
    return new User(doc.data());
  }

  // DELETE
  async delete(email) {
    const db = admin.firestore();
    await db.collection('users').doc(email).delete();
  }

  // OTHER QUERIES
  async emailExists(email) {
    // Query to check email uniqueness
  }

  async findAllByRole(role) {
    // Get all users with specific role
  }
}
```

---

### 3️⃣ **SERVICE LAYER** - `services/auth.service.js`

**Purpose**: Business logic & orchestration  
**Responsibility**: 
- Coordinate between Repository, EmailService, TokenService
- Implement business rules & validation
- Handle complex workflows

**Key Rule**: ✅ Can be called from anywhere (API, cron, workers)

```javascript
class AuthService {
  // ORCHESTRATE: User Registration Workflow
  async register(userData) {
    try {
      // 1️⃣ Validate: Check if email exists
      const userExists = await userRepository.emailExists(userData.email);
      if (userExists) {
        throw new Error('Email already registered');
      }

      // 2️⃣ Create: Instantiate User model
      const user = new User(userData);

      // 3️⃣ Persist: Save to database via Repository
      const savedUser = await userRepository.create(user);

      // 4️⃣ Generate: Create verification token
      const verificationToken = TokenService.generateVerificationToken();
      const hashedToken = TokenService.hashToken(verificationToken);

      // 5️⃣ Store: Update user with token
      await userRepository.update(savedUser.email, {
        emailVerificationToken: hashedToken,
        emailVerificationExpire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // 6️⃣ Notify: Send verification email (non-blocking)
      try {
        await EmailService.sendVerificationEmail(
          userData.email,
          userData.firstName,
          verificationToken
        );
      } catch (emailError) {
        console.error('Email sending failed, but user registered');
      }

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  // ORCHESTRATE: Email Verification Workflow
  async verifyEmail(email, token) {
    // 1️⃣ Fetch user from repository
    const user = await userRepository.findByEmail(email);
    
    // 2️⃣ Validate token using TokenService
    if (!TokenService.verifyHashedToken(token, user.emailVerificationToken)) {
      throw new Error('Invalid verification token');
    }

    // 3️⃣ Check expiry
    if (new Date() > user.emailVerificationExpire) {
      throw new Error('Verification token has expired');
    }

    // 4️⃣ Update user via Repository
    const verifiedUser = await userRepository.update(user.email, {
      isVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationExpire: null
    });

    // 5️⃣ Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.firstName);

    return verifiedUser;
  }

  // ORCHESTRATE: Login Workflow
  async login(email, password) {
    // 1️⃣ Find user
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    // 2️⃣ Verify password using model method
    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error('Invalid credentials');

    // 3️⃣ Update last login via Repository
    await userRepository.update(email, { lastLogin: new Date() });

    // 4️⃣ Generate JWT token via TokenService
    const token = TokenService.generateToken(user.email, user.role);

    return {
      token,
      user: user.getPublicProfile()
    };
  }

  // ORCHESTRATE: Password Reset Workflow
  async initiatePasswordReset(email) {
    // Find user
    // Generate reset token
    // Save token to DB
    // Send reset email
  }

  // ORCHESTRATE: Complete Password Reset
  async resetPassword(email, token, newPassword) {
    // Verify token
    // Update password
    // Clear token
    // Send confirmation email
  }
}
```

---

### 4️⃣ **CONTROLLER LAYER** - `controllers/auth.controller.js`

**Purpose**: HTTP request/response handling  
**Responsibility**: 
- Parse HTTP request
- Call Service
- Return HTTP response

**Key Rule**: ⛔ NO business logic, ONLY HTTP handling

```javascript
// ✅ CLEAN CONTROLLER
exports.register = async (req, res) => {
  try {
    // 1️⃣ Validate request (using express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 2️⃣ Extract HTTP request data
    const { firstName, lastName, email, password, role } = req.body;

    // 3️⃣ Call Service (ONLY SERVICE, not Repository)
    const user = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role
    });

    // 4️⃣ Return HTTP response
    res.status(201).json({
      message: 'Registration successful. Check your email.',
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ CLEAN CONTROLLER
exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    // Call Service
    const user = await authService.verifyEmail(email, token);

    // Return response
    res.json({
      message: 'Email verified successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ CLEAN CONTROLLER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call Service
    const { token, user } = await authService.login(email, password);

    // Set JWT in cookie & response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Return response
    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
```

---

### 5️⃣ **ROUTES LAYER** - `routes/auth.routes.js`

**Purpose**: Define API endpoints  
**Responsibility**: Map HTTP methods to controllers + middleware

```javascript
const router = express.Router();

// Authentication Endpoints
router.post(
  '/register',
  authValidationRules.register,        // Input validation
  authController.register               // Handler
);

router.post(
  '/verify-email',
  authValidationRules.verifyEmail,
  authController.verifyEmail
);

router.get(
  '/verify-email-link',
  authController.verifyEmailLink        // HTML response
);

router.post(
  '/login',
  authValidationRules.login,
  authController.login
);

router.post(
  '/password-reset-request',
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  authController.resetPassword
);

// OAuth Endpoints
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.oauthCallback
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  authController.oauthCallback
);

module.exports = router;
```

---

### 6️⃣ **MIDDLEWARE LAYER** - `middleware/auth.middleware.js`

**Purpose**: Cross-cutting concerns (authentication, authorization)  
**Responsibility**: Verify JWT tokens, check permissions

```javascript
// 1️⃣ JWT VERIFICATION MIDDLEWARE
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from header or cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // Verify token signature & expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data to request
    req.user = decoded;  // { email, role, iat, exp }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 2️⃣ OPTIONAL AUTH MIDDLEWARE
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Fail silently - auth is optional
  }
  
  next();
};

// 3️⃣ USAGE IN ROUTES
router.get(
  '/profile',
  authMiddleware,         // Must be authenticated
  userController.getProfile
);

router.get(
  '/public-profile/:email',
  optionalAuth,          // Optional authentication
  userController.getPublicProfile
);
```

---

### 7️⃣ **ROLE-BASED ACCESS CONTROL** - `middleware/role.middleware.js`

**Purpose**: Role-based authorization using CASL  
**Responsibility**: Check if user has permission for action

```javascript
// Using CASL (@casl/ability) library
const { defineAbility } = require('@casl/ability');

// 1️⃣ DEFINE ROLES & PERMISSIONS
const defineRules = (user) => {
  const { can, rules } = defineAbility((can, cannot) => {
    if (!user) return;

    const { role, email } = user;

    // STUDENT role
    if (role === 'student') {
      can('read', 'Profile', { userId: email });
      can('update', 'Profile', { userId: email });
      can('read', 'Projects', { studentId: email });
      can('create', 'Projects');
    }

    // ENTREPRENEUR role
    if (role === 'entrepreneur') {
      can('read', 'Profile', { userId: email });
      can('update', 'Profile', { userId: email });
      can('create', 'Projects');
      can('update', 'Projects', { entrepreneurId: email });
      can('delete', 'Projects', { entrepreneurId: email });
    }

    // INVESTOR role
    if (role === 'investor') {
      can('read', 'Profile', { userId: email });
      can('create', 'Investments');
      can('read', 'Investments', { investorId: email });
    }

    // MENTOR role
    if (role === 'mentor') {
      can('create', 'Feedback');
      can('read', 'Projects');
    }

    // COMPANY role
    if (role === 'company') {
      can('read', 'Projects');
      can('create', 'Partnerships');
    }

    // ADMIN role - FULL ACCESS
    if (role === 'admin') {
      can('manage', 'all');
    }
  });

  return { can, rules };
};

// 2️⃣ CHECK ABILITY MIDDLEWARE
const checkAbility = (action, subject) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Generate user abilities
    const { can } = defineRules(req.user);

    // Check if user can perform action on subject
    if (!can(action, subject)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

// 3️⃣ USAGE IN ROUTES
router.put(
  '/profile',
  authMiddleware,
  checkAbility('update', 'Profile'),  // Check permission
  userController.updateProfile
);

router.delete(
  '/projects/:id',
  authMiddleware,
  checkAbility('delete', 'Projects'),
  projectController.deleteProject
);
```

---

## 📊 Database Schema

### Firestore Collection: `users`

```
Collection: users
├── Document: user@email.com
│   ├── id: "user@email.com"
│   ├── firstName: "John"
│   ├── lastName: "Doe"
│   ├── email: "user@email.com"
│   ├── password: "$2a$10$..." (bcrypt hash)
│   ├── phone: "+1234567890"
│   ├── avatar: "gs://bucket/..." (Firebase Storage URL)
│   ├── role: "entrepreneur"
│   ├── isVerified: true
│   ├── emailVerifiedAt: Timestamp
│   ├── googleId: "google_123"
│   ├── facebookId: null
│   ├── profile: {
│   │   bio: "Founder...",
│   │   company: "Startup X",
│   │   location: "Dakar",
│   │   website: "www.startup.com",
│   │   specialization: "Tech",
│   │   yearsOfExperience: 5
│   │ }
│   ├── skills: ["JavaScript", "Python"]
│   ├── documents: ["resume.pdf"]
│   ├── preferences: {
│   │   emailNotifications: true,
│   │   smsNotifications: false,
│   │   privateProfile: false
│   │ }
│   ├── resetPasswordToken: "hashed_token"
│   ├── resetPasswordExpire: Timestamp
│   ├── emailVerificationToken: "hashed_token"
│   ├── emailVerificationExpire: Timestamp
│   ├── lastLogin: Timestamp
│   ├── isActive: true
│   ├── firebaseStoragePath: "gs://bucket/users/..."
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── Document: another@email.com
│   └── ...
```

### Indexes & Performance Optimization

```
Recommended Composite Indexes:
1. Collection: users
   Fields: (role, createdAt DESC)
   Purpose: Get users by role ordered by signup date

2. Collection: users
   Fields: (role, isActive, lastLogin DESC)
   Purpose: Get active users by role ordered by last login

3. Collection: users
   Fields: (googleId, isActive)
   Purpose: OAuth user lookup

4. Collection: users
   Fields: (facebookId, isActive)
   Purpose: OAuth user lookup
```

---

## 👥 User Roles & Permissions

### Six User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Student/Learner** | Learning & development focused | Create projects, read investments, find mentors |
| **Entrepreneur** | Startup founders & project carriers | Create/manage projects, seek investments, find partners |
| **Company/SME** | Small & medium enterprises | Browse entrepreneurs, form partnerships, seek talent |
| **Investor** | Investment & funding providers | Browse projects, create investments, track portfolio |
| **Mentor/Expert** | Knowledge & guidance providers | Review projects, provide feedback, guide learners |
| **Administrator** | System management | Full access (manage users, settings, system) |

### Permission Matrix

```
┌─────────────┬──────────┬──────────┬──────────┬────────┬────────┬───────┐
│ Action      │ Student  │ Entrepreneur │ Company│Investor│ Mentor │ Admin │
├─────────────┼──────────┼──────────────┼────────┼────────┼────────┼───────┤
│Read Profile │ Own      │ Own          │ Own    │ Own    │ Own    │ All   │
│Update Profile│ Own     │ Own          │ Own    │ Own    │ Own    │ All   │
│Create Project│ ✅      │ ✅           │ ❌     │ ❌     │ ❌     │ ✅    │
│Read Projects│ Own+All  │ All          │ All    │ All    │ All    │ All   │
│Delete Project│ Own     │ Own          │ ❌     │ ❌     │ ❌     │ ✅    │
│Create Investment│❌    │ ❌           │ ❌     │ ✅     │ ❌     │ ✅    │
│Read Investments│All   │ Own          │ ❌     │ Own    │ ❌     │ All   │
│Create Feedback│❌      │ ❌           │ ❌     │ ❌     │ ✅     │ ✅    │
│Manage Users │ ❌       │ ❌           │ ❌     │ ❌     │ ❌     │ ✅    │
└─────────────┴──────────┴──────────────┴────────┴────────┴────────┴───────┘
```

---

## 🔐 Authentication & Authorization Flow

### 1. Registration Flow

```
User submits registration form
         ↓
    Controller validates input
         ↓
    AuthService.register()
         ↓
    Check if email exists (Repository)
         ↓
    Create User model instance
         ↓
    Save to Firestore (Repository.create)
         ↓
    Generate verification token (TokenService)
         ↓
    Hash token & save to user (Repository.update)
         ↓
    Send verification email (EmailService)
         ↓
    Return success response with user
```

### 2. Email Verification Flow

```
User clicks verification link in email
         ↓
    GET /api/auth/verify-email-link?email=...&token=...
         ↓
    Controller calls AuthService.verifyEmail()
         ↓
    Fetch user from Firestore (Repository.findByEmail)
         ↓
    Verify token hash matches stored token (TokenService)
         ↓
    Check token not expired
         ↓
    Update user: isVerified=true (Repository.update)
         ↓
    Send welcome email (EmailService)
         ↓
    Return HTML success page
```

### 3. Login Flow

```
User submits email & password
         ↓
    Controller validates input
         ↓
    AuthService.login()
         ↓
    Fetch user from Firestore (Repository.findByEmail)
         ↓
    Compare password (Model.comparePassword using bcrypt)
         ↓
    Update lastLogin (Repository.update)
         ↓
    Generate JWT token (TokenService.generateToken)
         ↓
    Return token + user data
         ↓
    Client stores JWT in localStorage/cookie
```

### 4. Protected Route Access Flow

```
Client makes request with JWT
    Example: GET /api/user/profile
    Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
         ↓
    authMiddleware checks:
    ├─ Token present?
    ├─ Token valid signature?
    └─ Token not expired?
         ↓
    req.user = { email: "user@email.com", role: "entrepreneur", iat, exp }
         ↓
    Controller receives authenticated request
         ↓
    Process request & return response
```

### 5. Oauth (Google/Facebook) Flow

```
User clicks "Login with Google"
         ↓
    Redirect to Google OAuth consent screen
         ↓
    User authorizes app
         ↓
    Google redirects to: /api/auth/google/callback?code=...
         ↓
    Passport verifies code with Google
         ↓
    GoogleStrategy calls serialize/deserialize
         ↓
    Check if user exists by googleId (Repository.findByGoogleId)
         ↓
    If new user: Create new user with googleId (Repository.create)
    If exists: Update lastLogin (Repository.update)
         ↓
    Generate JWT token
         ↓
    Redirect to client with token
         ↓
    Client redirected to callback page
```

---

## 📡 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
├─ Body: { firstName, lastName, email, password, role }
├─ Response: { message, user }
└─ Status: 201 Created

POST /api/auth/verify-email
├─ Body: { email, token }
├─ Response: { message, user }
└─ Status: 200 OK

GET /api/auth/verify-email-link
├─ Query: ?email=...&token=...
├─ Response: HTML success/error page
└─ Status: 200 OK

POST /api/auth/login
├─ Body: { email, password }
├─ Response: { message, token, user }
├─ Cookies: Set HttpOnly cookie with token
└─ Status: 200 OK

POST /api/auth/password-reset-request
├─ Body: { email }
├─ Response: { message }
└─ Status: 200 OK

POST /api/auth/reset-password
├─ Body: { email, token, newPassword }
├─ Response: { message, user }
└─ Status: 200 OK

GET /api/auth/google
├─ Purpose: Initiate Google OAuth
└─ Redirects to Google consent screen

GET /api/auth/google/callback
├─ Purpose: Google OAuth callback
└─ Redirects to client with token

GET /api/auth/facebook
├─ Purpose: Initiate Facebook OAuth
└─ Redirects to Facebook login screen

GET /api/auth/facebook/callback
├─ Purpose: Facebook OAuth callback
└─ Redirects to client with token
```

### User Management Endpoints

```
GET /api/user/profile
├─ Auth: Required (JWT)
├─ Response: { user: { ...publicProfile } }
└─ Status: 200 OK

PUT /api/user/profile
├─ Auth: Required (JWT)
├─ Body: { firstName, lastName, phone, bio, company, ... }
├─ Response: { message, user }
└─ Status: 200 OK

GET /api/user/:email/public
├─ Auth: Optional
├─ Response: { user: { publicProfile } }
└─ Status: 200 OK

POST /api/user/avatar
├─ Auth: Required (JWT)
├─ Body: FormData with file
├─ Response: { message, avatarUrl }
└─ Status: 200 OK

GET /api/user/search
├─ Auth: Optional
├─ Query: ?role=entrepreneur&limit=10
├─ Response: { users: [...] }
└─ Status: 200 OK

DELETE /api/user/account
├─ Auth: Required (JWT)
├─ Body: { password }  (confirm password)
├─ Response: { message }
└─ Status: 200 OK

POST /api/user/preferences
├─ Auth: Required (JWT)
├─ Body: { emailNotifications, smsNotifications, ... }
├─ Response: { message, preferences }
└─ Status: 200 OK
```

### System Endpoints

```
GET /health
├─ Purpose: Health check
├─ Response: { status: "healthy" }
└─ Status: 200 OK

GET /api/docs
├─ Purpose: Swagger API documentation
└─ Returns: Swagger UI HTML page

GET /api/spec
├─ Purpose: OpenAPI specification
└─ Returns: JSON schema
```

---

## 🎯 Key Features Implemented

### ✅ Authentication Features

| Feature | Details |
|---------|---------|
| **Local Authentication** | Email & password login with bcrypt hashing |
| **JWT Tokens** | Stateless authentication with JWT tokens |
| **OAuth Integration** | Google & Facebook OAuth 2.0 integration |
| **Email Verification** | Email-based account verification with tokens |
| **Password Reset** | Secure password reset with token validation |
| **Session Management** | Express session for OAuth & web flows |
| **Token Refresh** | JWT tokens with configurable expiry |

### ✅ User Management

| Feature | Details |
|---------|---------|
| **Profile Management** | Create & update user profiles |
| **Avatar Upload** | Upload to Firebase Storage |
| **Role-Based Access** | 6 different user roles |
| **User Search** | Search & discover other users |
| **Account Deactivation** | Soft delete user accounts |
| **Preferences** | Notification & privacy settings |
| **OAuth Integration** | Link Google/Facebook accounts |

### ✅ Security Features

| Feature | Details |
|---------|---------|
| **Password Hashing** | bcryptjs with salt rounds |
| **CORS Protection** | Configurable CORS origins |
| **Helmet.js** | Security headers (CSP, HSTS, etc.) |
| **Rate Limiting** | Request throttling to prevent abuse |
| **Input Validation** | express-validator for all inputs |
| **JWT Verification** | Token signature & expiry validation |
| **HttpOnly Cookies** | Secure cookie storage for tokens |
| **HTTPS Support** | Secure transport (production) |

### ✅ Developer Features

| Feature | Details |
|---------|---------|
| **Swagger Documentation** | Auto-generated API docs |
| **Repository Pattern** | Clean, testable architecture |
| **Modular Structure** | Easy to add new features |
| **Error Handling** | Consistent error responses |
| **Logging** | Console logging for debugging |
| **Environment Config** | Flexible .env configuration |
| **Nodemon** | Auto-reload during development |

---

## 🔒 Security Implementation

### 1. Password Security

```javascript
// Hashing (bcryptjs)
const salt = await bcrypt.genSalt(10);          // 10 rounds
const hash = await bcrypt.hash(password, salt); // Very slow to crack

// Verification
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Why bcryptjs?**
- Adaptive hash function (gets slower as computers get faster)
- Automatically salts passwords
- Protects against rainbow tables
- Industry standard for Node.js

### 2. JWT Token Security

```javascript
// Token Structure
Header:    { alg: "HS256", typ: "JWT" }
Payload:   { email: "user@email.com", role: "entrepreneur", iat, exp }
Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET)

// Token Verification
1. Verify signature with SECRET
2. Check token not expired (exp > now)
3. Extract user data from payload
4. Attach to req.user
```

**Security Measures:**
- ✅ Signed with SECRET key (environment variable)
- ✅ Includes expiry (configurable, e.g., 24 hours)
- ✅ Cannot be modified without invalidating signature
- ✅ Verified on every protected route
- ✅ Stored in HttpOnly cookie (secure from XSS)

### 3. OAuth Security

```javascript
// Google OAuth Flow
1. User clicks "Login with Google"
2. Redirect to Google with client_id, redirect_uri
3. User authorizes app & consents
4. Google sends authorization code (short-lived)
5. Backend exchanges code for tokens (server-to-server)
6. Backend verifies token signature with Google's public key
7. Extract user info (email, name, etc.)
8. Lookup or create user in database
9. Generate own JWT for session
```

**Security Benefits:**
- ✅ Password never shared with app
- ✅ Authorization code expires quickly
- ✅ Tokens verified server-to-server
- ✅ Google handles credential security
- ✅ No password storage required

### 4. Request Validation

```javascript
// Input Validation (express-validator)
router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('role').isIn(['student', 'entrepreneur', 'company', 'investor', 'mentor']),
  authController.register
);
```

**Prevents:**
- ✅ SQL injection (not applicable with NoSQL, but prevents logic errors)
- ✅ Invalid email format
- ✅ Weak passwords
- ✅ Unexpected data types
- ✅ XSS attacks (by sanitizing)

### 5. HTTP Security Headers (Helmet.js)

```javascript
app.use(helmet());

// Headers set by Helmet:
X-Content-Type-Options: nosniff          // Prevent MIME type sniffing
X-Frame-Options: DENY                    // Prevent clickjacking
Content-Security-Policy: default-src 'self'  // Prevent inline scripts
X-XSS-Protection: 1; mode=block          // Enable browser XSS filter
Strict-Transport-Security: max-age=...   // Force HTTPS
```

### 6. Rate Limiting

```javascript
// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 900000,        // 15 minute window
  max: 100,                // Max 100 requests per window
  message: 'Too many requests from this IP'
});

app.use('/api/auth/', limiter);  // Apply to auth endpoints
```

**Prevents:**
- ✅ Brute force attacks (password guessing)
- ✅ DDoS attacks
- ✅ API abuse

### 7. CORS Protection

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Prevents:**
- ✅ Cross-Origin attacks
- ✅ Unauthorized API calls from other domains
- ✅ Cookie/credential theft

### 8. Data Protection

| Data | Protection | Method |
|------|-----------|--------|
| **Password** | Encrypted at rest | bcryptjs hashing |
| **JWT Tokens** | Encrypted in transit | HTTPS + HttpOnly Cookie |
| **Email** | Hashed for verification | SHA256 hashing |
| **Reset Tokens** | Hashed & single-use | SHA256 + expiry |
| **OAuth Tokens** | Server-side only | Never sent to client |
| **Personal Data** | Access control | Role-based middleware |

---

## 📋 Integration Points for New Modules

When adding new features or modules to GIEA Platform, follow this pattern:

### Step 1: Create Model

```
src/modules/myfeature/models/
├── myfeature.model.js      # Data-only class
└── index.js                # Exports
```

### Step 2: Create Repository

```
src/modules/myfeature/repositories/
├── myfeature.repository.js # All DB operations
└── index.js                # Exports
```

### Step 3: Create Service

```
src/modules/myfeature/services/
├── myfeature.service.js    # Business logic
└── index.js                # Exports
```

### Step 4: Create Controller

```
src/modules/myfeature/controllers/
├── myfeature.controller.js # HTTP handlers
└── index.js                # Exports
```

### Step 5: Create Routes

```
src/modules/myfeature/routes/
├── myfeature.routes.js     # Route definitions
└── index.js                # Exports
```

### Step 6: Create Middleware (if needed)

```
src/modules/myfeature/middleware/
├── myfeature.middleware.js # Custom middleware
└── index.js                # Exports
```

### Step 7: Create Utils (if needed)

```
src/modules/myfeature/utils/
├── validators.js           # Validation rules
├── helpers.js              # Utility functions
└── index.js                # Exports
```

### Step 8: Update Module Index

```
src/modules/myfeature/index.js  # Exports all from module
```

### Step 9: Register Routes in Main App

```
// src/index.js
const { myfeatureRoutes } = require('./modules/myfeature/routes');
app.use('/api/myfeature', myfeatureRoutes);
```

---

## 🚀 Development Workflow

### Setup

```bash
# 1. Clone repository
git clone <repo-url>

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with Firebase credentials

# 4. Start development server
npm run dev    # With auto-reload (nodemon)
npm start      # Production mode
```

### Testing

```bash
# Manual testing
./test/manual-test.ps1

# Quick testing
./test/quick-test.ps1

# Full test suite
./test/run-test.ps1
```

### API Documentation

```
# Open browser to Swagger UI
http://localhost:5000/api/docs
```

---

## 📚 Related Documentation

For more detailed information, see:

- [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) - Deep dive into architecture
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Complete API reference
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - Testing strategies
- [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md) - Add new modules
- [PROFILE_MANAGEMENT_GUIDE.md](./PROFILE_MANAGEMENT_GUIDE.md) - User profiles
- [GOOGLE_OAUTH_TESTING_GUIDE.md](./GOOGLE_OAUTH_TESTING_GUIDE.md) - OAuth setup

---

## 📞 Support & Questions

For questions about the GIEA Platform architecture:

1. Check the documentation files in `/doc/`
2. Review the code comments in relevant modules
3. Check existing issues in GitHub
4. Consult the team

---

**Last Updated**: 2024  
**Maintained By**: GIEA Platform Team
