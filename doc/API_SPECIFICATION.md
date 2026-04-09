# GIEA Platform - API Specification

## Project Structure - Modular Architecture

The GIEA Platform uses a **modular folder structure** to enable better team collaboration and scalability. Each module represents a distinct feature area:

```
src/
├── modules/
│   ├── authentication/          # Authentication module (Login, Register, Token Management)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── index.js
│   ├── [other-modules]/         # Add more modules as needed
│   └── ...
├── config/                      # Shared configuration
├── middleware/                  # Shared middleware
├── utils/                       # Shared utilities
└── index.js                     # Main application file
```

### Adding New Modules
When adding a new feature module:
1. Create a folder inside `src/modules/[module-name]`
2. Follow the same structure: `controllers/`, `routes/`, `middleware/`, `models/`, `services/`
3. Create an `index.js` file to export the module
4. Update `src/index.js` to register the module's routes

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

## Authentication

### JWT Token Structure
```javascript
{
  userId: "user_id_string",
  role: "student|entrepreneur|investor|mentor|company|admin",
  iat: 1234567890,         // issued at
  exp: 1234567890 + 7days  // expiration
}
```

### Token Usage
```http
Authorization: Bearer <jwt_token>
// OR
Cookie: token=<jwt_token>
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, uppercase, lowercase, number)",
  "role": "string (optional, default: student)"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string",
    "isVerified": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

**Errors:**
- 400: Email already registered
- 400: Invalid email format
- 400: Password doesn't meet requirements
- 500: Server error

---

#### POST /api/auth/verify-email
Verify user email with token from email.

**Request:**
```json
{
  "token": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

**Errors:**
- 400: Invalid or expired verification token
- 500: Server error

---

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": "ObjectId",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string",
    "lastLogin": "ISO8601"
  }
}
```

**Errors:**
- 401: Invalid email or password
- 403: Email not verified
- 500: Server error

---

#### POST /api/auth/logout
Logout current user (clears token cookie).

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset link has been sent to your email"
}
```

**Errors:**
- 404: No user with that email
- 500: Error sending email

---

#### POST /api/auth/reset-password
Reset password with token from email.

**Request:**
```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 chars, uppercase, lowercase, number)"
}
```

**Response (200 OK):**
```json
{
  "message": "Password has been reset successfully"
}
```

**Errors:**
- 400: Invalid or expired reset token
- 400: Password doesn't meet requirements

---

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "role": "string",
  "avatar": "url",
  "isVerified": true,
  "profile": {
    "bio": "string",
    "company": "string",
    "location": "string",
    "website": "url",
    "specialization": "string",
    "yearsOfExperience": "number"
  },
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": false,
    "privateProfile": false
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Errors:**
- 401: No authentication token
- 401: Token expired or invalid
- 404: User not found

---

### OAuth Endpoints

#### GET /api/auth/google
Redirect to Google OAuth login.

**Query Parameters:**
```
scope: profile,email (automatic)
```

**Redirect:** Google OAuth consent screen

---

#### GET /api/auth/google/callback
Google OAuth callback (internal).

**Redirect:** 
```
{CLIENT_URL}/auth-callback?token={jwt_token}
```

---

#### GET /api/auth/facebook
Redirect to Facebook OAuth login.

**Redirect:** Facebook OAuth consent screen

---

#### GET /api/auth/facebook/callback
Facebook OAuth callback (internal).

**Redirect:** 
```
{CLIENT_URL}/auth-callback?token={jwt_token}
```

---

## User Management

All user management endpoints require authentication (`Authorization: Bearer <token>`).

### GET /api/users/profile/:userId
Get user profile by ID.

**Parameters:**
- `userId` (path, ObjectId)

**Response (200 OK):**
```json
{
  "id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "avatar": "url",
  "role": "string",
  "profile": {
    "bio": "string",
    "company": "string",
    "location": "string",
    "website": "url",
    "specialization": "string",
    "yearsOfExperience": "number"
  },
  "createdAt": "ISO8601"
}
```

**Note:** If user has private profile, email and phone are hidden (except own profile).

---

#### PUT /api/users/profile
Update current user profile.

**Request:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional, valid format)",
  "bio": "string (optional)",
  "company": "string (optional)",
  "location": "string (optional)",
  "website": "url (optional)",
  "specialization": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": { /* full user object */ }
}
```

**Errors:**
- 400: Validation error
- 404: User not found
- 500: Server error

---

#### POST /api/users/avatar
Upload user avatar to Firebase Storage.

**Request:**
```
Content-Type: multipart/form-data
file: <image_file>
```

**Supported formats:** JPEG, PNG, GIF, WebP
**Max size:** 10MB

**Response (200 OK):**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://firebasestorage_signed_url"
}
```

**Errors:**
- 400: No file uploaded
- 400: Invalid file type
- 404: User not found
- 500: Firebase upload error

---

#### PUT /api/users/preferences
Update user notification preferences.

**Request:**
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "privateProfile": false
}
```

**Response (200 OK):**
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": false,
    "privateProfile": false
  }
}
```

---

#### POST /api/users/change-password
Change password for current user.

**Request:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars, uppercase, lowercase, number)"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- 400: Validation error
- 401: Current password incorrect
- 404: User not found

---

#### GET /api/users/search
Search users with filters.

**Query Parameters:**
- `q` (optional): Search query (searches firstName, lastName, email)
- `role` (optional): Filter by role (student|entrepreneur|investor|mentor|company|admin)
- `skip` (optional, default: 0): Number of results to skip
- `limit` (optional, default: 20, max: 100): Number of results to return

**Example:**
```
GET /api/users/search?q=john&role=entrepreneur&skip=0&limit=20
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "ObjectId",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "avatar": "url",
      "profile": { /* profile info */ }
    }
  ],
  "total": 42,
  "skip": 0,
  "limit": 20
}
```

---

#### DELETE /api/users/deactivate
Deactivate current user account.

**Response (200 OK):**
```json
{
  "message": "Account deactivated successfully"
}
```

**Note:** Token is automatically cleared on deactivation.

---

## Data Models

### User Schema

```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed, not returned in API),
  phone: String (unique, optional),
  avatar: String (URL, optional),
  role: Enum (student|entrepreneur|investor|mentor|company|admin),
  
  // Verification status
  isVerified: Boolean (default: false),
  emailVerifiedAt: Date (optional),
  phoneVerifiedAt: Date (optional),
  
  // OAuth IDs
  googleId: String (unique, optional),
  facebookId: String (unique, optional),
  
  // Profile information
  profile: {
    bio: String,
    company: String,
    location: String,
    website: String (URL),
    specialization: String,
    yearsOfExperience: Number
  },
  
  // User preferences
  preferences: {
    emailNotifications: Boolean (default: true),
    smsNotifications: Boolean (default: false),
    privateProfile: Boolean (default: false)
  },
  
  // Security tokens
  resetPasswordToken: String (hashed),
  resetPasswordExpire: Date,
  emailVerificationToken: String (hashed),
  emailVerificationExpire: Date,
  
  // Activity
  lastLogin: Date,
  isActive: Boolean (default: true),
  
  // Storage
  firebaseStoragePath: String,
  
  // Timestamps
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### User Roles and Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **student** | Learners and students | Browse projects, join programs |
| **entrepreneur** | Project carriers, startup founders | Create projects, seek investment |
| **company** | SME, established companies | Post opportunities, hire mentors |
| **investor** | Investment providers | Browse projects, invest |
| **mentor** | Experts and advisors | Mentor projects, provide guidance |
| **admin** | System administrators | Manage users, moderate content |

---

## Error Handling

### Error Response Format

```json
{
  "message": "Error description",
  "errors": [
    {
      "param": "fieldName",
      "msg": "Error message",
      "value": "submitted_value"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid credentials or token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "No authentication token" | Missing Authorization header | Add `Authorization: Bearer <token>` |
| "Token has expired" | JWT token expired | Login again to get new token |
| "Invalid token" | Corrupted or invalid token | Login again |
| "Email already registered" | Duplicate email | Use different email or login |
| "Invalid email format" | Email validation failed | Use valid email format |
| "Password doesn't meet requirements" | Weak password | Use 8+ chars, uppercase, lowercase, number |
| "User not found" | User ID doesn't exist | Check user ID |
| "Access denied" | User lacks permissions | Contact admin if needed |

---

## Rate Limiting

### Rate Limit Configuration

**Window:** 15 minutes (900,000 ms)
**Max Requests:** 100 per IP per window

### Rate Limited Endpoints

- All `/api/auth/*` endpoints
- `/api/users/change-password`

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### Rate Limit Error

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

Status Code: 429 Too Many Requests

---

## Validation Rules

### Email
- Valid email format (RFC 5322)
- Must be unique
- Case-insensitive storage

### Password
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- Examples:
  - ✅ SecurePass123
  - ✅ MyPassword1
  - ❌ password123 (no uppercase)
  - ❌ PASSWORD (no lowercase, no number)
  - ❌ Pass1 (too short)

### Phone Number
- Valid phone format (optional)
- Supports international format
- Examples:
  - ✅ +33612345678
  - ✅ 06 12 34 56 78
  - ✅ (123) 456-7890

### Website URL
- Valid URL format
- Must include protocol (http:// or https://)
- Examples:
  - ✅ https://example.com
  - ✅ http://www.example.com
  - ❌ example.com (missing protocol)

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `skip`: Number of items to skip (default: 0)
- `limit`: Number of items to return (default: 20, max: 100)

**Response:**
```json
{
  "data": [ /* items */ ],
  "total": 1000,
  "skip": 0,
  "limit": 20
}
```

---

## API Versioning

Current API Version: **v1** (default)

Future versions will use: `/api/v2/`, `/api/v3/`, etc.

---

## CORS Policy

**Allowed Origins:**
- Development: `http://localhost:3000`
- Production: Set via `CLIENT_URL` env variable

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization

**Credentials:** Enabled (cookies, authorization headers)

---

## Best Practices

### Client-Side
1. Always store JWT token securely (httpOnly cookies recommended)
2. Include token in Authorization header for authenticated requests
3. Handle token expiration and refresh logic
4. Validate user input before sending to API
5. Display user-friendly error messages

### Error Handling
1. Check HTTP status code first
2. Display message from response
3. Log full error for debugging
4. Implement retry logic for 500 errors
5. Redirect to login on 401 errors

### Performance
1. Use pagination for list endpoints
2. Cache user profile data client-side
3. Implement request debouncing for search
4. Use query params for filtering
5. Minimize API calls where possible

---

## Testing

### Example Requests (cURL)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Changelog

### Version 1.0.0 (Initial Release)
- User registration and verification
- JWT authentication
- OAuth integration (Google, Facebook)
- User profile management
- Avatar upload to Firebase
- Password reset functionality
- Role-based access control
- User search functionality

