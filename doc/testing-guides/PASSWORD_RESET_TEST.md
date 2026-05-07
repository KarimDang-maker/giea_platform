# Password Reset Flow - Testing Guide

This guide helps you test and debug the password reset flow end-to-end.

## Prerequisites

✅ Server running on `http://localhost:5000`  
✅ Email service configured (Gmail)  
✅ User account exists and is verified  

## Test Flow

### Step 1: Request Password Reset

**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "your_test_email@gmail.com"
}
```

**Expected Response:**
```json
{
  "message": "Password reset link has been sent to your email. Please check your inbox and follow the link to reset your password",
  "success": true
}
```

**Status Code:** ✅ `200 OK`

---

### Step 2: Check Email

1. Check your email inbox
2. Look for email from: `guegouoguiddel@gmail.com`
3. Find the reset link like: `http://localhost:5000/api/auth/reset-password?email=yourmail&token=XXXXX`
4. **Copy the `token` value** from the link

---

### Step 3: Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "email": "your_test_email@gmail.com",
  "token": "PASTE_TOKEN_HERE",
  "newPassword": "NewPassword123!"
}
```

**Expected Response:**
```json
{
  "message": "Password has been reset successfully. You can now log in with your new password",
  "success": true
}
```

**Status Code:** ✅ `200 OK`

**Important Notes:**
- ✅ New password must be at least 8 characters
- ✅ Token is valid for 1 hour
- ✅ Each token can only be used once
- ✅ If you see error "Token mismatch", you copied it wrong

---

### Step 4: Login with New Password

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "your_test_email@gmail.com",
  "password": "NewPassword123!"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "your_test_email@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "email": "your_test_email@gmail.com",
    "role": "student",
    "isVerified": true,
    "avatar": "",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:45:00.000Z"
  }
}
```

**Status Code:** ✅ `200 OK`

---

## Testing Scenarios

### ✅ Scenario 1: Successful Reset
- [ ] Request reset with valid email
- [ ] Receive email with reset link
- [ ] Use token to reset password
- [ ] Login with new password

### ❌ Scenario 2: Invalid Token
- [ ] Request reset
- [ ] Modify the token value
- [ ] Submit modified token
- **Expected:** `400` - "Invalid reset token"

### ❌ Scenario 3: Expired Token
- [ ] Request reset
- [ ] Wait 1+ hours
- [ ] Try to use the token
- **Expected:** `400` - "Reset token has expired"

### ❌ Scenario 4: Missing Fields
- [ ] Submit without email
- **Expected:** `400` - "Email is required"
- [ ] Submit without token
- **Expected:** `400` - "Email, token, and new password are required"

### ❌ Scenario 5: Weak Password
- [ ] Submit password with < 8 characters
- **Expected:** `400` - "Password must be at least 8 characters long"

---

## Using Postman

### 1. Create Forgot Password Request
```
POST http://localhost:5000/api/auth/forgot-password
Body (JSON):
{
  "email": "test@example.com"
}
```

### 2. Create Reset Password Request
```
POST http://localhost:5000/api/auth/reset-password
Body (JSON):
{
  "email": "test@example.com",
  "token": "YOUR_TOKEN_HERE",
  "newPassword": "NewPassword123!"
}
```

### 3. Create Login Request
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "NewPassword123!"
}
```

---

## Troubleshooting

### Problem: "No reset token" or "Invalid reset token"

**Causes:**
- Token was modified incorrectly
- Copy/paste included extra spaces
- Email address changed

**Solution:**
```javascript
// Check browser console for token in email link
console.log("Token from URL:", new URL(emailLink).searchParams.get('token'));
```

### Problem: "Token mismatch" or verification fails

**Causes:**
- Token was hashed incorrectly during storage
- Database issue

**Solution:**
- Check server logs: `console.error` messages
- Verify Firebase connection

### Problem: Password reset successful but login fails

**Causes:**
- Password wasn't saved to database
- Password comparison failed

**Solution:**
- Check database record for user
- Verify password hash starts with `$2a` or `$2b`

### Problem: Email not received

**Causes:**
- Gmail credentials incorrect
- App password not used (check .env)
- Email blocked by Gmail

**Solution:**
```
Check .env:
- EMAIL_SERVICE=gmail ✅
- EMAIL_USER=guegouoguiddel@gmail.com ✅
- EMAIL_PASSWORD=ylim iaiu afxc iodo ✅
```

---

## Database Verification

### Check User Password Hash

```javascript
// In your Firestore console, view the user document:
// Collection: users
// Document: test@example.com
// Field: password should start with $2a or $2b (bcrypt hash)

// Example: $2b$10$... (this is correct)
```

### Check Reset Token Status

After reset, verify:
```javascript
resetPasswordToken: null   // ✅ Should be null/empty
resetPasswordExpire: null  // ✅ Should be null
```

---

## Quick Test Command

Run this in your terminal:

```bash
# Request reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Reset password (use token from email)
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"YOUR_TOKEN","newPassword":"NewPassword123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"NewPassword123!"}'
```

---

## Next Steps

✅ Password reset flow is complete!

- [ ] Test all 5 scenarios
- [ ] Verify email delivery
- [ ] Check error messages
- [ ] Monitor server logs
- [ ] Document any issues

