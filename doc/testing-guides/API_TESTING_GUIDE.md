# GIEA Platform - Direct API Testing Guide

## 🚀 Architecture-Based Testing

Testing follows the auth service architecture:
1. **Security Layer** (Helmet + Rate Limit)
2. **Input Validation** (express-validator)
3. **Routes** (Auth endpoints)
4. **Auth Strategies** (Passport)
5. **Hash + Token** (bcrypt + JWT)
6. **RBAC** (CASL middleware)
7. **Database** (Firestore)

---

## 📋 Test Scenarios

### TEST 1: Register User
**Endpoint**: `POST /api/auth/register`

**Command:**
```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
    password = "TestPass123!"
    role = "student"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Success (201):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "isVerified": false
  }
}
```

**What it tests:**
- ✅ Validation (email format, password strength)
- ✅ User model creation
- ✅ Firestore write
- ✅ Email service

---

### TEST 2: Verify Email
**Endpoint**: `POST /api/auth/verify-email`

**Note**: You need the token from the verification email sent to your Gmail

**Command:**
```powershell
$body = @{
    email = "john@example.com"
    token = "PASTE_TOKEN_FROM_EMAIL_HERE"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/verify-email `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Success (200):**
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

**What it tests:**
- ✅ Token verification
- ✅ Firestore update
- ✅ Welcome email service

---

### TEST 3: Login
**Endpoint**: `POST /api/auth/login`

**Command:**
```powershell
$body = @{
    email = "john@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Save token for next requests
$jsonResponse = $response.Content | ConvertFrom-Json
$script:TOKEN = $jsonResponse.token
Write-Host "`nToken saved: $script:TOKEN"
```

**Expected Success (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "john@example.com",
    "firstName": "John",
    "role": "student",
    "isVerified": true
  }
}
```

**What it tests:**
- ✅ Password verification (bcrypt)
- ✅ Email verification check
- ✅ JWT token generation
- ✅ Authentication strategy

---

### TEST 4: Get Current User (Protected Route)
**Endpoint**: `GET /api/auth/me`

**Requirements**: Need JWT token from login

**Command:**
```powershell
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Paste token from login
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/me `
  -Method GET `
  -Headers $headers `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Success (200):**
```json
{
  "id": "john@example.com",
  "firstName": "John",
  "email": "john@example.com",
  "role": "student"
}
```

**What it tests:**
- ✅ JWT verification (authMiddleware)
- ✅ Protected routes
- ✅ Token authentication

---

### TEST 5: Update Profile (RBAC Protected)
**Endpoint**: `PUT /api/users/profile`

**Requirements**: JWT token + RBAC permissions

**Command:**
```powershell
$body = @{
    phone = "+1234567890"
    location = "New York"
    bio = "Software Developer"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Paste token
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri http://localhost:5000/api/users/profile `
  -Method PUT `
  -Headers $headers `
  -Body $body `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Success (200):**
```json
{
  "message": "Profile updated successfully"
}
```

**What it tests:**
- ✅ JWT authentication
- ✅ CASL permissions (checkAbility)
- ✅ Firestore update
- ✅ Data validation

---

### TEST 6: Search Users
**Endpoint**: `GET /api/users/search`

**Command:**
```powershell
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Paste token
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/users/search?q=john&role=student" `
  -Method GET `
  -Headers $headers `
  -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Success (200):**
```json
[
  {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
]
```

**What it tests:**
- ✅ Firestore queries
- ✅ Search with filters
- ✅ RBAC enforcement

---

## 🔍 Testing Each Layer

### Layer 1: Security (Helmet)
Check response headers:
```powershell
$response = Invoke-WebRequest http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body '{}' `
  -SkipHttpErrorCheck

Write-Host "Security Headers:"
$response.Headers | Format-Table

# Should see:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: SAMEORIGIN
# - Strict-Transport-Security: ...
```

### Layer 2: Rate Limiting
```powershell
# Make 5 requests rapidly
for ($i = 1; $i -le 5; $i++) {
    $response = Invoke-WebRequest http://localhost:5000/api/auth/register `
      -Method POST `
      -ContentType "application/json" `
      -Body '{}' `
      -SkipHttpErrorCheck
    
    Write-Host "Request $i - Status: $($response.StatusCode)"
    Write-Host "Rate Limit Remaining: $($response.Headers['RateLimit-Remaining'])"
}
```

### Layer 3: Validation
```powershell
# Invalid email
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "invalid-email"
    password = "weak"
    role = "student"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -SkipHttpErrorCheck

# Should return 400 with validation errors
Write-Host "Status: $($response.StatusCode)"
$response.Content
```

### Layer 4: Authentication Pipeline
```powershell
# Test with invalid token
$headers = @{
    "Authorization" = "Bearer invalid-token"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest http://localhost:5000/api/auth/me `
  -Method GET `
  -Headers $headers `
  -SkipHttpErrorCheck

# Should return 401
Write-Host "Status: $($response.StatusCode)"
$response.Content
```

### Layer 5: RBAC (Check Permissions)
```powershell
# Admin-only endpoint with student token
$headers = @{
    "Authorization" = "Bearer STUDENT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest http://localhost:5000/api/users/deactivate `
  -Method DELETE `
  -Headers $headers `
  -SkipHttpErrorCheck

# Should return 403 (Forbidden)
Write-Host "Status: $($response.StatusCode)"
$response.Content
```

---

## 📊 Complete Test Flow Script

Save this as `test-api.ps1`:

```powershell
# ============================================
# GIEA Platform - Complete API Test Script
# ============================================

$BaseUrl = "http://localhost:5000"
$TestEmail = "testuser-$(Get-Random)@example.com"
$TestPassword = "TestPass123!"

Write-Host "🚀 Starting API Tests..." -ForegroundColor Green
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "Test Email: $TestEmail" -ForegroundColor Cyan
Write-Host ""

# Test 1: Register
Write-Host "━━ TEST 1: Register User ━━" -ForegroundColor Yellow
$registerBody = @{
    firstName = "Test"
    lastName = "User"
    email = $TestEmail
    password = $TestPassword
    role = "student"
} | ConvertTo-Json

$registerResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $registerBody `
  -SkipHttpErrorCheck

Write-Host "Status: $($registerResponse.StatusCode)" -ForegroundColor $(if ($registerResponse.StatusCode -eq 201) { "Green" } else { "Red" })
$registerJson = $registerResponse.Content | ConvertFrom-Json
Write-Host "Message: $($registerJson.message)"
Write-Host ""

# Test 2: Login
Write-Host "━━ TEST 2: Login User ━━" -ForegroundColor Yellow
$loginBody = @{
    email = $TestEmail
    password = $TestPassword
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody `
  -SkipHttpErrorCheck

if ($loginResponse.StatusCode -eq 200) {
    Write-Host "Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    $loginJson = $loginResponse.Content | ConvertFrom-Json
    $TOKEN = $loginJson.token
    Write-Host "Login Successful - Token: $($TOKEN.Substring(0, 20))..."
    Write-Host ""
    
    # Test 3: Get Current User
    Write-Host "━━ TEST 3: Get Current User (Protected) ━━" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $meResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/me" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    Write-Host "Status: $($meResponse.StatusCode)" -ForegroundColor Green
    $meJson = $meResponse.Content | ConvertFrom-Json
    Write-Host "Current User: $($meJson.firstName) $($meJson.lastName) ($($meJson.role))"
    Write-Host ""
    
    # Test 4: Update Profile
    Write-Host "━━ TEST 4: Update Profile (RBAC) ━━" -ForegroundColor Yellow
    $profileBody = @{
        phone = "+1-555-0123"
        location = "New York"
        bio = "Test user bio"
    } | ConvertTo-Json
    
    $profileResponse = Invoke-WebRequest -Uri "$BaseUrl/api/users/profile" `
      -Method PUT `
      -Headers $headers `
      -Body $profileBody `
      -ContentType "application/json" `
      -SkipHttpErrorCheck
    
    Write-Host "Status: $($profileResponse.StatusCode)" -ForegroundColor Green
    $profileJson = $profileResponse.Content | ConvertFrom-Json
    Write-Host "Message: $($profileJson.message)"
    Write-Host ""
    
} else {
    Write-Host "Status: $($loginResponse.StatusCode)" -ForegroundColor Red
    $loginErrorJson = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Error: $($loginErrorJson.message)"
}

Write-Host "✅ API Testing Complete" -ForegroundColor Green
```

---

## 🎯 Run Tests

### **Quick Health Check:**
```powershell
curl http://localhost:5000/health
```

### **Run Complete Test Suite:**
```powershell
# Save test script first, then run
.\test-api.ps1
```

### **Test Individual Endpoint:**
```powershell
# Register
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Test123!","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@test.com","password":"Test123!"}'
```

---

## 📊 What Each Test Validates

| Test | Layer | Validates |
|------|-------|-----------|
| Register | Routes + Validation | Input validation, Firestore write |
| Email Verify | Auth Strategy | Token verification |
| Login | Auth + JWT | Password hashing, JWT generation |
| Get Me | Protected Routes | JWT verification, auth middleware |
| Update Profile | RBAC | Permission checking (CASL) |
| Search | Firestore | Database queries, filtering |

---

## 🔧 Troubleshooting

**401 Unauthorized:**
- Token expired or invalid
- Check: Bear token in header

**403 Forbidden:**
- Insufficient permissions for role
- Check: CASL rules, user role

**404 Not Found:**
- Endpoint doesn't exist
- Check: URL spelling, route definition

**500 Server Error:**
- See server logs: `npm run dev`
- Check: Invalid token format, Firestore errors

---

## ✅ Success Criteria

All tests passing means:
- ✅ Security layer working (Helmet, Rate Limit)
- ✅ Validation working (input checks)
- ✅ Authentication working (Passport, JWT)
- ✅ Authorization working (CASL RBAC)
- ✅ Database working (Firestore CRUD)
- ✅ Email service working (verification)
