# GIEA Platform - Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your Firebase credentials
# Minimum required:
# - FIREBASE_PROJECT_ID
# - FIREBASE_STORAGE_BUCKET
# - FIREBASE_CLIENT_EMAIL
# - FIREBASE_PRIVATE_KEY
# - JWT_SECRET
# - EMAIL_USER and EMAIL_PASSWORD (for email verification)
```

### Step 2: Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Firestore Database
4. Enable Cloud Storage
5. Generate service account credentials:
   - Settings → Service Accounts
   - Generate new private key (JSON)
   - Use values for `.env` file

### Step 3: Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Step 4: Test the API

#### Create .rest file for testing (VSCode REST Client extension)
Create `test.rest` file:

```http
### Register a new user
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}

###
### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

###
### Get current user (use token from login response)
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE

###
### Update profile
PUT http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe Jr",
  "bio": "Developer and entrepreneur"
}

###
### Search users
GET http://localhost:5000/api/users/search?q=john&limit=10
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Configuration Checklist

### Minimum Setup (Local Development)
- [ ] Firebase Firestore enabled in Firebase Console
- [ ] Firebase Storage enabled in Firebase Console
- [ ] `.env` file created with Firebase credentials
- [ ] `JWT_SECRET` set in `.env`
- [ ] `npm install` completed
- [ ] `npm run dev` started

### Full Setup (With Email & OAuth)
- [ ] Firebase project created with Firestore and Storage
- [ ] Service account credentials added to `.env`
- [ ] Gmail account with App Password configured
- [ ] Google OAuth credentials added to `.env`
- [ ] Facebook app credentials added to `.env`
- [ ] Firestore Security Rules configured

## Project Files Overview

| File | Purpose |
|------|---------|
| `src/index.js` | Main application server |
| `src/config/database.js` | Firebase Firestore initialization |
| `src/config/passport.js` | Authentication strategies |
| `src/models/user.model.js` | User Firestore model |
| `src/controllers/auth.controller.js` | Auth logic (register, login, etc) |
| `src/controllers/user.controller.js` | User management logic |
| `src/middleware/auth.middleware.js` | JWT verification middleware |
| `src/middleware/role.middleware.js` | Role-based access control |
| `src/routes/auth.routes.js` | Auth endpoints |
| `src/routes/user.routes.js` | User endpoints |
| `src/services/email.service.js` | Email sending functionality |
| `src/services/token.service.js` | JWT token operations |
| `src/utils/helpers.js` | Validation rules & utilities |

## Common Issues & Solutions

### Issue: "Cannot find module 'firebase-admin'"
**Solution**: Run `npm install`

### Issue: "Firestore initialization failed"
**Solution**: 
- Verify Firebase credentials in `.env`
- Ensure Firestore is enabled in Firebase Console
- Download correct service account key

### Issue: Email not sending
**Solution**:
- Enable [Gmail App Password](https://support.google.com/accounts/answer/185833)
- Update `EMAIL_PASSWORD` in `.env`

### Issue: Firebase upload failing
**Solution**:
- Download Firebase service account JSON
- Update Firebase env variables in `.env`
- Check Storage Rules in Firebase Console allow uploads

### Issue: Port 5000 already in use
**Solution**: 
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

## Next Steps

1. **Test all endpoints** - Use the provided `test.rest` file
2. **Set up frontend** - Create React/Vue client that connects to this API
3. **Add more modules** - Projects management, investments, messaging, etc.
4. **Deploy** - Set up CI/CD pipeline and deploy to production
5. **Scale** - Add caching, load balancing, monitoring

## Useful Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix

# View npm dependencies
npm list
```

## API Base URL
- **Development**: `http://localhost:5000`
- **Production**: Update in your deployment environment

## Support

For issues:
1. Check the main README.md for API documentation
2. Review error messages in server console
3. Check `.env` configuration
4. Verify all dependencies are installed

## Architecture Notes

This platform follows a **MVC (Model-View-Controller)** pattern:
- **Models**: Define database schemas (`src/models/`)
- **Controllers**: Contain business logic (`src/controllers/`)
- **Routes**: Define API endpoints (`src/routes/`)
- **Middleware**: Handle cross-cutting concerns (`src/middleware/`)
- **Services**: Reusable logic for emails, tokens, etc (`src/services/`)
- **Config**: External services configuration (`src/config/`)

## Security Reminders

⚠️ **DO NOT**:
- Commit `.env` file to version control
- Use weak JWT secrets
- Skip email verification in production
- Disable HTTPS in production

✅ **DO**:
- Use strong passwords
- Enable rate limiting
- Review user input validation
- Monitor server logs
- Keep dependencies updated
