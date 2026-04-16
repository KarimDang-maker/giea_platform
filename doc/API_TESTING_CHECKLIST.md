# API Testing Checklist - GIEA Platform

## ✅ Server Status
- **Server Running:** YES ✅
- **Port:** 5000
- **Swagger Docs:** http://localhost:5000/api/docs
- **Database:** Firebase Firestore (Initialized ✅)
- **Email Service:** Gmail (Configured ✅)
- **Google OAuth:** Configured ✅

---

## Testing Protocol

### 1. **POST /api/auth/register** - User Registration
**Purpose:** Create a new user account

**Test Case 1.1: Valid Registration**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "student"
}
```
Expected Response: 201
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "isVerified": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Test Case 1.2: Invalid Email**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "invalid-email",
  "password": "SecurePass123!",
  "role": "student"
}
```
Expected: 400 (Invalid email format)

**Test Case 1.3: Weak Password (less than 8 chars, no uppercase, etc.)**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "weak123",
  "role": "student"
}
```
Expected: 400 (Password doesn't meet requirements)

**Test Case 1.4: Duplicate Email**
Register with same email twice
Expected: 400 (Email already registered)

---

### 2. **POST /api/auth/verify-email** - Email Verification
**Purpose:** Verify email with token from verification email

**Test Case 2.1: Valid Verification**
1. After registration, check the console for verification token (or email if configured)
2. Send:
```json
{
  "email": "john.doe@example.com",
  "token": "{verification_token_from_email}"
}
```
Expected: 200 (Email verified successfully)

**Test Case 2.2: Invalid Token**
```json
{
  "email": "john.doe@example.com",
  "token": "invalid_token_123"
}
```
Expected: 400 (Invalid or expired verification token)

---

### 3. **POST /api/auth/login** - User Login
**Purpose:** Authenticate user and get JWT token

**Test Case 3.1: Valid Login (After Email Verification)**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```
Expected: 200
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "lastLogin": "..."
  }
}
```

**Test Case 3.2: Wrong Password**
```json
{
  "email": "john.doe@example.com",
  "password": "WrongPassword123!"
}
```
Expected: 401 (Invalid email or password)

**Test Case 3.3: Email Not Verified**
- Register new user, try to login WITHOUT verifying email
Expected: 403 (Email not verified)

**Test Case 3.4: Non-existent Email**
```json
{
  "email": "nonexistent@example.com",
  "password": "SecurePass123!"
}
```
Expected: 401 (Invalid email or password)

---

### 4. **GET /api/auth/me** - Get Current User
**Purpose:** Retrieve authenticated user profile

**Headers:**
```
Authorization: Bearer {jwt_token_from_login}
```

Expected: 200
```json
{
  "id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "student",
  "isVerified": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 5. **POST /api/auth/logout** - User Logout
**Purpose:** Clear authentication

**Headers:**
```
Authorization: Bearer {jwt_token}
```

Expected: 200
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. **POST /api/auth/forgot-password** - Password Reset Request
**Purpose:** Request password reset email

```json
{
  "email": "john.doe@example.com"
}
```

Expected: 200
```json
{
  "message": "Password reset link has been sent to your email"
}
```

---

### 7. **POST /api/auth/reset-password** - Reset Password
**Purpose:** Reset password with token

1. Check console/email for reset token
2. Send:
```json
{
  "email": "john.doe@example.com",
  "token": "{reset_token_from_email}",
  "newPassword": "NewSecurePass456!"
}
```

Expected: 200
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

---

### 8. **GET /api/auth/google** - Google OAuth Login
**Purpose:** Initiate Google OAuth flow

**⚠️ IMPORTANT - Google OAuth Testing:**

The Google OAuth is configured but only works properly in these scenarios:

**Option A: Browser Testing (Recommended)**
1. Open browser to: `http://localhost:5000/api/auth/google`
2. You'll be redirected to Google login page
3. After login, redirected back with JWT token

**Option B: Swagger UI**
1. Go to Swagger: `http://localhost:5000/api/docs`
2. Find "GET /api/auth/google" endpoint
3. Click "Try it out" → "Execute"
4. Browser will open Google login

**Option C: Postman/cURL (CANNOT be tested directly)**
- Google OAuth requires browser redirect and cannot be tested via Postman/cURL with form parameters
- Must use browser or Swagger UI

**Why Google OAuth might appear "not working":**
1. ❌ Testing from Postman/cURL (won't work - needs browser)
2. ❌ Missing GOOGLE_CLIENT_ID credentials
3. ❌ Incorrect GOOGLE_CALLBACK_URL
4. ❌ Firestore not initialized properly
5. ✅ Firestore IS initialized in this setup
6. ✅ Google credentials ARE configured

---

## Test Order Recommended

1. **Registration** (POST /api/auth/register)
   - ✅ Test valid registration
   - ✅ Test invalid email
   - ✅ Test weak password
   - ✅ Test duplicate email

2. **Email Verification** (POST /api/auth/verify-email)
   - ✅ Get token from registration response or console
   - ✅ Test verification

3. **Login** (POST /api/auth/login)
   - ✅ Test after verification
   - ✅ Test with wrong password
   - ✅ Test without verification

4. **Get Current User** (GET /api/auth/me)
   - ✅ Use token from login

5. **Password Reset**
   - ✅ POST /api/auth/forgot-password
   - ✅ POST /api/auth/reset-password (with token from email)

6. **Google OAuth**
   - ✅ Use browser or Swagger UI
   - ✅ Verify redirect and JWT token creation

7. **Logout** (POST /api/auth/logout)
   - ✅ After any successful login

---

## How to Test in Swagger UI

1. **Open:** http://localhost:5000/api/docs
2. **Find endpoint:** Authentication section
3. **Click "Try it out"** on any endpoint
4. **Fill in Request Body** with test data
5. **Click "Execute"**
6. **Check Response** (should show 200, 201, 400, etc.)
7. **For authenticated endpoints:** Use token from login response in Authorization header

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Registration fails with 400 | Invalid email or weak password | Check email format and password requirements (8+ chars, uppercase, lowercase, number) |
| Login returns 403 | Email not verified | Run verify-email endpoint first |
| Google redirects not working | Missing credentials | Check .env for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET |
| "Cannot POST in Swagger" | CORS issue | Already configured, but may need browser refresh |
| Tokens not working | Token expired or invalid | Generate new token from login |

---

## Next Steps

✅ All endpoints are configured and ready for testing
✅ Server is running
✅ Swagger UI is accessible
✅ Google OAuth is configured

**Start testing with:** http://localhost:5000/api/docs
