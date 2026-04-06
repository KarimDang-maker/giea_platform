# GIEA Platform

**Plateforme multirole de gestion des activité du Groupement d'intérêt économique africain**

A comprehensive multi-role platform for managing economic activities with secure authentication, role-based access control, and user management capabilities.

## Features

### Authentication Module
- ✅ User Registration with email verification
- ✅ Secure Login with JWT tokens and session management
- ✅ Password reset functionality
- ✅ OAuth integration (Google, Facebook)
- ✅ Email verification and notifications
- ✅ Rate limiting for security

### User Management
- ✅ Profile management
- ✅ Role-based access control (RBAC)
- ✅ User search and discovery
- ✅ Avatar upload to Firebase Storage
- ✅ Preferences and notification settings
- ✅ Account deactivation

### Security Features
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ bcrypt password hashing
- ✅ JWT token authentication
- ✅ XSS prevention
- ✅ Rate limiting

### User Roles
- 👨‍🎓 **Student/Learner** - Learning and development
- 🚀 **Entrepreneur** - Project carriers and startups
- 💼 **Company/SME** - Small and medium enterprises
- 💰 **Investor** - Investment and funding
- 🎓 **Mentor/Expert** - Guidance and expertise
- 👨‍💼 **Administrator** - System management

## Project Structure

```
giea_platform/
├── src/
│   ├── config/
│   │   ├── database.js         # Firebase Firestore initialization
│   │   └── passport.js         # Passport.js configuration
│   ├── routes/
│   │   ├── auth.routes.js      # Authentication endpoints
│   │   └── user.routes.js      # User management endpoints
│   ├── controllers/
│   │   ├── auth.controller.js  # Auth logic
│   │   └── user.controller.js  # User logic
│   ├── models/
│   │   └── user.model.js       # User model (Firestore)
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── role.middleware.js  # Role-based access
│   ├── services/
│   │   ├── email.service.js    # Email sending
│   │   └── token.service.js    # Token operations
│   ├── utils/
│   │   └── helpers.js          # Utilities and validation
│   └── index.js                # Application entry point
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

## Setup Instructions

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
   
   Edit `.env` and update the following:
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

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}

Response: 201
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": { ... }
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}

Response: 200
{
  "message": "Email verified successfully. You can now log in."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": { ... }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response: 200
{
  "message": "Logged out successfully"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200
{
  "message": "Password reset link has been sent to your email"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}

Response: 200
{
  "message": "Password has been reset successfully"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200
{
  "id": "user_id",
  "firstName": "John",
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
