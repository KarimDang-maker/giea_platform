# GIEA Platform

**Plateforme multirole de gestion des activité du Groupement d'intérêt économique africain**

A comprehensive multi-role platform for managing economic activities with secure authentication, role-based access control, dashboard management, project administration, marketplace operations, categorization, and advanced reporting.

## ✨ Features

### 🔐 Authentication Module
- ✅ User Registration with email verification
- ✅ Secure Login with JWT tokens and session management
- ✅ Password reset functionality (email-based)
- ✅ OAuth integration (Google, Facebook)
- ✅ Email verification and notifications
- ✅ Rate limiting for security

### 👤 User Management
- ✅ Comprehensive Profile management
- ✅ Role-based access control (RBAC)
- ✅ User search and discovery
- ✅ Avatar upload to Firebase Storage
- ✅ Preferences and notification settings
- ✅ Account deactivation

### 📊 Dashboard Module
- ✅ Personalized user dashboard with widgets
- ✅ Recent activity tracking
- ✅ AI-powered recommendations (project, resource, connection, skill, category, community)
- ✅ Quick links by role
- ✅ User statistics and profile completion
- ✅ Activity history and notifications
- ✅ Dashboard refresh capabilities

### 📈 Report Module
- ✅ Activity report generation
- ✅ Analytics reports with metrics and insights
- ✅ Report scheduling and distribution
- ✅ Multi-format export (JSON, CSV, PDF)
- ✅ Platform statistics aggregation
- ✅ Report archiving and management
- ✅ Trend analysis and historical data

### 📁 Categories Module
- ✅ Hierarchical category management
- ✅ Sub-categories and nesting support
- ✅ Category search and filtering
- ✅ Category-based content organization
- ✅ Dynamic category operations

### 🚀 Project Management (Gestion des Projets)
- ✅ Project creation and submission
- ✅ Multi-step project workflow (soumis, en_evaluation, en_revision, bancable, rejete, archivé)
- ✅ Funding request management
- ✅ Project status tracking
- ✅ Stakeholder collaboration
- ✅ Project analytics and metrics

### 🛍️ Marketplace Module
- ✅ Company profile management
- ✅ Product and service listings
- ✅ Search and discovery
- ✅ Business operations management
- ✅ News and updates sharing
- ✅ Rating and review system

### 🔒 Security Features
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ bcrypt password hashing
- ✅ JWT token authentication
- ✅ XSS prevention
- ✅ Rate limiting
- ✅ Input validation (express-validator)
- ✅ Firestore security rules

### 👥 User Roles
- 👨‍🎓 **Student/Learner** - Learning and development
- 🚀 **Entrepreneur** - Project carriers and startups
- 💼 **Company/SME** - Small and medium enterprises
- 💰 **Investor** - Investment and funding
- 🎓 **Mentor/Expert** - Guidance and expertise
- 👨‍💼 **Administrator** - System management and reporting

## 📂 Project Structure

```
giea_platform/
├── src/
│   ├── config/
│   │   ├── database.js              # Firebase Firestore initialization
│   │   ├── passport.js              # Passport.js OAuth configuration
│   │   ├── multer.js                # File upload configuration
│   │   └── swagger.js               # API documentation setup
│   ├── modules/
│   │   ├── authentication/
│   │   │   ├── controllers/         # Auth request handlers
│   │   │   ├── models/              # User data models
│   │   │   ├── services/            # Auth business logic
│   │   │   ├── repositories/        # Database operations
│   │   │   ├── middleware/          # Auth & role middleware
│   │   │   ├── routes/              # Auth endpoints
│   │   │   └── utils/               # Validators & helpers
│   │   ├── dashboard/
│   │   │   ├── controllers/         # Dashboard handlers
│   │   │   ├── models/              # Dashboard data structures
│   │   │   ├── services/            # Dashboard logic
│   │   │   ├── repositories/        # Dashboard CRUD
│   │   │   ├── routes/              # Dashboard endpoints
│   │   │   └── utils/               # Validators
│   │   ├── report/
│   │   │   ├── controllers/         # Report handlers
│   │   │   ├── models/              # Report structures
│   │   │   ├── services/            # Report logic
│   │   │   ├── repositories/        # Report database ops
│   │   │   ├── routes/              # Report endpoints
│   │   │   └── utils/               # Validators
│   │   ├── categories/
│   │   │   ├── controllers/         # Category handlers
│   │   │   ├── models/              # Category structures
│   │   │   ├── services/            # Category logic
│   │   │   ├── repositories/        # Category operations
│   │   │   ├── routes/              # Category endpoints
│   │   │   └── utils/               # Validators
│   │   ├── gestion_projets/
│   │   │   ├── controllers/         # Project handlers
│   │   │   ├── models/              # Project structures
│   │   │   ├── services/            # Project logic
│   │   │   ├── repositories/        # Project operations
│   │   │   ├── routes/              # Project endpoints
│   │   │   └── utils/               # Validators
│   │   └── marketplace/
│   │       ├── controllers/         # Marketplace handlers
│   │       ├── models/              # Marketplace structures
│   │       ├── services/            # Business logic
│   │       ├── repositories/        # Data operations
│   │       ├── routes/              # Marketplace endpoints
│   │       └── utils/               # Validators
│   ├── utils/
│   │   └── helpers.js               # Global utilities
│   ├── public/
│   │   ├── auth-callback.html       # OAuth callback page
│   │   ├── reset-password.html      # Password reset page
│   │   └── swagger-theme-toggle.js  # UI helpers
│   └── index.js                     # Application entry point
├── scripts/
│   ├── setup-firestore.js           # Database initialization
│   ├── create-indexes.js            # Index creation
│   └── create-indexes-v2.js         # Updated index creation
├── doc/                             # Comprehensive documentation (25+ files)
├── test/                            # Testing scripts
├── .env.example                     # Environment variables template
├── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- Firebase project with Firestore and Storage enabled
- Optional: Google/Facebook OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KarimDang-maker/giea_platform.git
   cd giea_platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Firebase Firestore (required)
   FIREBASE_PROJECT_ID=giea-c40d6
   FIREBASE_STORAGE_BUCKET=giea-c40d6.firebasestorage.app
   FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_admin_private_key

   # JWT
   JWT_SECRET=your_strong_jwt_secret_key
   JWT_EXPIRE=7d

   # Email Service (Gmail recommended)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret

   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

4. **Initialize Firestore Database**
   ```bash
   npm run setup-db
   ```

5. **Start the server**
   ```bash
   # Development with hot reload
   npm run dev

   # Production
   npm start
   ```

The server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Interactive API Documentation
Visit Swagger UI: `http://localhost:5000/api/docs`

### Available Endpoints

#### Authentication (`/api/auth`)
- `POST /auth/register` - User registration
- `POST /auth/verify-email` - Email verification
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password` - Complete password reset
- `GET /auth/me` - Get current user profile
- `GET /auth/google` - Google OAuth login
- `GET /auth/facebook` - Facebook OAuth login

#### User Management (`/api/users`)
- `GET /users` - List users with search/filter
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile
- `DELETE /users/{id}` - Delete user account
- `POST /users/{id}/avatar` - Upload avatar
- `GET /users/{id}/activities` - User activities

#### Dashboard (`/api/dashboard`)
- `GET /dashboard` - Get personalized dashboard
- `POST /dashboard/refresh` - Refresh dashboard data
- `GET /dashboard/activities` - Recent activities
- `GET /dashboard/activities/type/{type}` - Activities by type
- `GET /dashboard/recommendations` - Personalized recommendations
- `GET /dashboard/recommendations/type/{type}` - Recommendations by type
- `POST /dashboard/recommendations/generate` - Generate new recommendations
- `POST /dashboard/recommendations/{id}/dismiss` - Dismiss recommendation

#### Reports (`/api/reports`)
- `POST /reports` - Create activity report
- `POST /reports/analytics` - Create analytics report
- `GET /reports` - List reports (with filters)
- `GET /reports/{id}` - Get report details
- `GET /reports/type/{type}` - Get reports by type
- `PUT /reports/{id}` - Update report
- `DELETE /reports/{id}` - Delete report
- `POST /reports/{id}/schedule` - Schedule distribution
- `POST /reports/{id}/unschedule` - Stop distribution
- `GET /reports/{id}/export` - Export report
- `POST /reports/archive` - Archive old reports

#### Statistics (`/api/statistics`)
- `GET /statistics/latest` - Latest platform statistics
- `GET /statistics/period` - Statistics by period
- `GET /statistics/trends` - Statistics trends
- `POST /statistics/generate` - Generate statistics
- `GET /statistics/users` - User statistics
- `GET /statistics/projects` - Project statistics
- `GET /statistics/marketplace` - Marketplace statistics

#### Categories (`/api/categories`)
- `GET /categories` - List all categories
- `POST /categories` - Create category
- `GET /categories/{id}` - Get category details
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category
- `GET /categories/search` - Search categories

#### Projects (`/api/projets`)
- `POST /projets` - Create project
- `GET /projets` - List projects
- `GET /projets/{id}` - Get project details
- `PUT /projets/{id}` - Update project
- `DELETE /projets/{id}` - Delete project
- `GET /projets/status/{status}` - Projects by status
- `POST /projets/{id}/status` - Update project status

#### Marketplace (`/api/marketplace`)
- `GET /marketplace/companies` - List companies
- `POST /marketplace/companies` - Create company
- `GET /marketplace/products` - List products
- `POST /marketplace/products` - Create product
- `GET /marketplace/services` - List services
- `POST /marketplace/services` - Create service
- `GET /marketplace/news` - List news

## 📖 Documentation

Complete documentation is available in the `/doc` folder:

- **[QUICKSTART.md](doc/QUICKSTART.md)** - Quick start guide
- **[DASHBOARD_MODULE_GUIDE.md](doc/DASHBOARD_MODULE_GUIDE.md)** - Dashboard features
- **[REPORT_MODULE_GUIDE.md](doc/REPORT_MODULE_GUIDE.md)** - Report generation & management
- **[CATEGORIES_API_TESTING_GUIDE.md](doc/CATEGORIES_API_TESTING_GUIDE.md)** - Categories API
- **[GUIDE_TEST_GESTION_DES_PROJETS.md](doc/GUIDE_TEST_GESTION_DES_PROJETS.md)** - Project management
- **[PROFILE_MANAGEMENT_GUIDE.md](doc/PROFILE_MANAGEMENT_GUIDE.md)** - User profiles
- **[MODULE_DEVELOPMENT_GUIDE.md](doc/MODULE_DEVELOPMENT_GUIDE.md)** - Development standards
- **[ARCHITECTURE_GUIDE.md](doc/ARCHITECTURE_GUIDE.md)** - System architecture
- **[FINAL_SUMMARY.md](doc/FINAL_SUMMARY.md)** - Project completion summary

## 🧪 Testing

### Run Tests
```bash
# Quick test
npm run test:quick

# Full test suite
npm run test

# Manual testing with PowerShell
./test/run-test.ps1
```

## 🛠️ Development

### NPM Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run linting
npm run lint

# Setup Firestore
npm run setup-db

# Create indexes
npm run create-indexes
```

### Code Style
- Node.js/Express.js best practices
- Repository pattern for data access
- Service layer for business logic
- Middleware for cross-cutting concerns
- Environment-based configuration

## 🔧 Key Technologies

- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Authentication:** JWT, OAuth 2.0
- **Validation:** express-validator
- **Security:** helmet.js, bcrypt
- **API Docs:** Swagger/OpenAPI
- **Email:** Nodemailer
- **File Upload:** Multer
- **Environment:** dotenv

## 📋 Module Overview

### Authentication Module
Handles user authentication with JWT tokens, OAuth integration, email verification, and secure password management.

### Dashboard Module
Provides personalized user dashboards with activity tracking, AI-powered recommendations, and quick access to key features.

### Report Module
Generates comprehensive reports with statistics, supports scheduling, distribution, and multi-format export.

### Categories Module
Manages hierarchical category structures for organizing content across the platform.

### Project Management Module
Handles project submissions, workflow management, funding requests, and stakeholder collaboration.

### Marketplace Module
Manages company profiles, products, services, and business operations.

## 📊 Database Schema

**Collections in Firestore:**
- `users` - User accounts and profiles
- `activities` - User activity logs
- `dashboards` - User dashboard data
- `recommendations` - Personalized recommendations
- `reports` - Generated reports
- `statistics` - Platform statistics
- `categories` - Content categories
- `projets` - Project submissions
- `marketplace_companies` - Business profiles
- `marketplace_products` - Product listings
- `marketplace_services` - Service offerings
- `marketplace_news` - News & updates

## 🚀 Deployment

### Environment Configuration
Set appropriate values for production:
- `NODE_ENV=production`
- Update Firebase credentials
- Configure production email service
- Set secure JWT secret

### Firebase Hosting
```bash
firebase deploy
```

### Cloud Run / Heroku / Other
Follow platform-specific deployment guides with the environment configuration.

## 🐛 Troubleshooting

### Common Issues

**"Admin role required" error**
- Verify user role is set to "admin"
- Check JWT token validity
- Ensure Bearer token format: `Authorization: Bearer {token}`

**"Report not found" error**
- Verify report ID is correct
- Check if report has been archived
- Confirm access permissions

**Firestore Index Errors**
- Use in-memory filtering instead of composite indexes
- See [REPOSITORY_PATTERN_IMPLEMENTATION.md](doc/REPOSITORY_PATTERN_IMPLEMENTATION.md)

**OAuth Issues**
- Verify OAuth credentials in `.env`
- Check OAuth callback URLs
- See [GOOGLE_OAUTH_TESTING_GUIDE.md](doc/GOOGLE_OAUTH_TESTING_GUIDE.md)

## 📝 License

This project is proprietary software.

## 👥 Contributors

GIEA Platform Development Team

## 📞 Support

For issues and support, refer to the documentation in the `/doc` folder or contact the development team.

---

**Last Updated:** April 30, 2026  
**Version:** 2.0.0 (Multi-Module Platform)
  "lastName": "Doe",
  "email": "john@example.com",
  ...
}
```

### User Management Endpoints

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Developer and entrepreneur",
  "company": "StartUp Inc",
  "location": "New York",
  "website": "https://johndoe.com"
}

Response: 200
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Upload Avatar
```http
POST /users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image_file]

Response: 200
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://firebasestorage_url"
}
```

#### Get User Profile
```http
GET /users/profile/{userId}
Authorization: Bearer {token}

Response: 200
{
  "id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

#### Change Password
```http
POST /users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}

Response: 200
{
  "message": "Password changed successfully"
}
```

#### Search Users
```http
GET /users/search?q=john&role=student&skip=0&limit=20
Authorization: Bearer {token}

Response: 200
{
  "data": [ ... ],
  "total": 1,
  "skip": 0,
  "limit": 20
}
```

#### Update Preferences
```http
PUT /users/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": false,
  "privateProfile": false
}

Response: 200
{
  "message": "Preferences updated successfully",
  "preferences": { ... }
}
```

#### Deactivate Account
```http
DELETE /users/deactivate
Authorization: Bearer {token}

Response: 200
{
  "message": "Account deactivated successfully"
}
```

### OAuth Endpoints

#### Google Login
```
GET /auth/google
```

#### Facebook Login
```
GET /auth/facebook
```

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description",
  "errors": []
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials or token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Use HTTPS in production** - Set `NODE_ENV=production`
3. **Strong JWT Secret** - Use a strong random string for `JWT_SECRET`
4. **Password Requirements** - Enforce strong passwords
5. **Rate Limiting** - Enabled on auth routes to prevent brute force
6. **Email Verification** - Required before login
7. **Token Expiry** - JWT tokens expire after 7 days
8. **Secure Cookies** - HttpOnly and Secure flags enabled

## Development

### Start development server with auto-reload
```bash
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

## Deployment

### Firebase Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database in Firebase Console
3. Enable Storage in Firebase Console
4. Generate a service account private key (Settings → Service Accounts)
5. Add credentials to `.env` file

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in all Firebase credentials
3. Set strong `JWT_SECRET`
4. Configure email service (Gmail App Password)
5. Set up OAuth credentials if needed

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS/TLS
- [ ] Set secure Firebase credentials
- [ ] Configure proper CORS origins
- [ ] Set up email service (Gmail App Password)
- [ ] Configure OAuth redirect URLs
- [ ] Monitor error logs
- [ ] Run security audit: `npm audit`
- [ ] Enable Firestore backups
- [ ] Set up access rules for Firestore

## Troubleshooting

### Firestore Connection Error
- Check that your Firebase project is set up correctly
- Verify `FIREBASE_PROJECT_ID` and credentials in `.env`
- Ensure Firestore has been enabled in Firebase Console

### Email Not Sending
- Enable "Less secure apps" or use App Password for Gmail
- Check email credentials in `.env`
- Verify SMTP settings

### Firebase Upload Failing
- Check Firebase credentials in `.env`
- Verify Storage Rules allow uploads in Firebase Console
- Ensure bucket name matches `FIREBASE_STORAGE_BUCKET`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using the port

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Authentication**: Passport.js, JWT, OAuth 2.0
- **Security**: Helmet.js, bcryptjs, Rate Limiting
- **Email**: Nodemailer
- **Validation**: express-validator

## License

ISC

## Contributing

Contributions are welcome! Please follow the project structure and style guidelines.

## Support

For issues or questions, please open an issue on GitHub.

## Author

Karim Dang

## Next Steps

- [ ] Set up MongoDB connection
- [ ] Configure Firebase project
- [ ] Set up email service
- [ ] Test authentication endpoints
- [ ] Implement additional modules (projects, investments, etc.)
- [ ] Set up frontend client
- [ ] Deploy to production
