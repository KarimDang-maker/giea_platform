# Mobile App Password Reset Flow Guide

## Overview
This guide explains the new password reset flow designed specifically for mobile applications. The flow is now split into clear, independent steps.

---

## 📱 Mobile App Password Reset Flow (3-Step Process)

### **Step 1: User Requests Password Reset**
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent to it"
}
```

**What happens:**
- Backend checks if user exists (security: doesn't reveal if email exists)
- Generates a unique reset token (valid for 1 hour)
- Sends email with reset link containing token
- Example email link: `https://yourapp.com/reset-password?email=user@example.com&token=abc123...`

---

### **Step 2: User Clicks Email Link & Verifies Token (JSON Endpoint)**
**Endpoint:** `POST /api/auth/verify-password-reset-token`

**Request:** (sent from mobile app after user clicks link)
```json
{
  "email": "user@example.com",
  "token": "abc123def456..."  // Token from email link
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset token verified successfully. You can now reset your password.",
  "token": "abc123def456..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Password reset token has expired. Please request a new password reset."
}
```

**What happens:**
- Token is verified (not yet used)
- Token expiry is checked (1 hour limit)
- Returns JSON response (NOT HTML) so mobile app can proceed
- User is notified token is valid and can enter new password

---

### **Step 3: User Enters New Password in Mobile App & Submits**
**Endpoint:** `POST /api/auth/reset-password`

**Request:** (from mobile app)
```json
{
  "email": "user@example.com",
  "token": "abc123def456...",
  "newPassword": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now log in with your new password"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Password reset token has expired. Please request a new password reset."
}
```

**What happens:**
- Token and email are verified together
- Passwords are validated (min 8 characters, must match)
- Old password is hashed and replaced in database
- Reset token is invalidated (can't be used again)
- User can now login with new password

---

## 🎯 Mobile App Implementation Steps

### **In Your Mobile App:**

```javascript
// Step 1: User enters email and clicks "Reset Password"
async function requestPasswordReset(email) {
  try {
    const response = await fetch('https://api.yourapp.com/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    console.log('Reset email sent');
    // Show: "Check your email for reset link"
  } catch (error) {
    console.error('Error:', error);
  }
}

// Step 2: User clicks link in email, goes back to app
// Email link format: myapp://reset-password?email=user@example.com&token=abc123...
// Your app deep-linking should capture these parameters

async function verifyResetToken(email, token) {
  try {
    const response = await fetch('https://api.yourapp.com/api/auth/verify-password-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show password reset form to user
      navigateToPasswordResetForm(email, token);
    } else {
      showError(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Step 3: User enters new password
async function resetPassword(email, token, newPassword, confirmPassword) {
  try {
    const response = await fetch('https://api.yourapp.com/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        token,
        newPassword,
        confirmPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigateToLogin(), 2000);
    } else {
      showError(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    showError('Failed to reset password. Please try again.');
  }
}
```

---

## 🔗 Email Link Setup

### **Email Template (HTML):**
The email sent to users should include a deep-linking URL:

```html
<a href="myapp://reset-password?email={{email}}&token={{token}}">
  Click here to reset your password
</a>
```

**Where:**
- `myapp://` is your app's custom protocol (configure in your mobile app)
- `{{email}}` and `{{token}}` are replaced with actual values
- When user clicks, it opens your mobile app with these parameters

### **Deep-Linking Configuration:**

**React Native:**
```javascript
// Configure deep-linking in your app
const linking = {
  prefixes: ['myapp://', 'https://yourapp.com'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};

const ResetPasswordScreen = ({ route }) => {
  const { email, token } = route.params;
  // ... use these to verify token and reset password
};
```

**Flutter:**
```dart
// Configure in your AndroidManifest.xml and Info.plist
// Then handle in your app
void _handleDeepLink(String? link) {
  if (link?.startsWith('myapp://reset-password') ?? false) {
    final uri = Uri.parse(link!);
    final email = uri.queryParameters['email'];
    final token = uri.queryParameters['token'];
    // Navigate to reset password screen
  }
}
```

---

## 🔐 Security Considerations

1. **Token Expiry:** Reset tokens expire after **1 hour**
2. **One-Time Use:** Token becomes invalid after successful password reset
3. **Email Verification:** Token is hashed in database (never stored in plain text)
4. **HTTPS Only:** All requests should use HTTPS in production
5. **Password Requirements:**
   - Minimum 8 characters
   - Should include uppercase, lowercase, numbers, special chars (validate in app)

---

## ❌ Error Handling

### **Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| `User not found` | Email doesn't exist in system | Direct user to sign up |
| `Password reset token has expired` | More than 1 hour passed | Request new reset token |
| `Invalid reset token` | Token is invalid/corrupted | Request new reset token |
| `Passwords do not match` | Confirmation password doesn't match | Check inputs |
| `Password must be at least 8 characters` | Too short password | Use longer password |

---

## 📋 Testing Checklist

- [ ] **Forgot Password:** User receives email with reset link
- [ ] **Token Verification:** Token is valid immediately after click
- [ ] **Token Expiry:** Token expires after 1 hour
- [ ] **Wrong Token:** Invalid token shows proper error
- [ ] **Password Mismatch:** Different passwords show error
- [ ] **Password Reset:** New password works for login
- [ ] **Token Reuse:** Using token twice fails on second attempt
- [ ] **Different Email:** Email in token doesn't match request email (fails)
- [ ] **Email Verification:** Deep-link properly captures email and token from URL

---

## 🚀 API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|----------------|
| `/api/auth/forgot-password` | POST | Request reset token | No |
| `/api/auth/verify-password-reset-token` | POST | Verify token (Mobile) | No |
| `/api/auth/verify-password-reset` | GET | Verify token (Web - HTML) | No |
| `/api/auth/reset-password` | POST | Reset password | No |

---

## 📝 Notes

- **Old Web Flow Still Works:** GET `/api/auth/verify-password-reset` still returns HTML page for web browsers
- **Mobile-Specific:** New POST `/api/auth/verify-password-reset-token` returns JSON for mobile apps
- **Email Parameter:** Optional in `/api/auth/reset-password` but REQUIRED for mobile flow
- **Token Formats:** All tokens are 64-character hex strings (e.g., `abc123def456...`)

