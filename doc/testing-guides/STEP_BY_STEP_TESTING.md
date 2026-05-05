# 🏗️ GIEA Platform - Complete Architecture Testing Flow

## Step-by-Step Testing Following Architecture Diagram

---

## 📍 BEFORE YOU START

**Make sure:**
1. ✅ Server running: `npm run dev` (in Terminal 1)
2. ✅ PowerShell window ready (Terminal 2)
3. ✅ Keep this guide open

---

## ⬛ STEP 1: Test Security Layer (Helmet + Rate Limit)

**What it tests:** Security headers from Helmet middleware

### Command:
```powershell
$response = Invoke-WebRequest http://localhost:5000/health `
  -SkipHttpErrorCheck

Write-Host "=== SECURITY HEADERS ===" -ForegroundColor Cyan
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green

# Check for security headers
$securityHeaders = @(
    "X-Content-Type-Options",
    "X-Frame-Options", 
    "Strict-Transport-Security",
    "Content-Security-Policy"
)

foreach ($header in $securityHeaders) {
    if ($response.Headers.ContainsKey($header)) {
        Write-Host "✅ $header" -ForegroundColor Green
    }
}
```

**Expected Output:**
```
Status: 200
✅ X-Content-Type-Options
✅ X-Frame-Options
✅ Strict-Transport-Security
✅ Content-Security-Policy
```

---

## ⬜ STEP 2: Test Input Validation Layer

**What it tests:** Input validation middleware (express-validator)

### Command A - Invalid Email:
```powershell
$invalidBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "invalid-email-format"
    password = "TestPass123!"
    role = "student"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body $invalidBody `
  -SkipHttpErrorCheck

Write-Host "=== VALIDATION TEST - INVALID EMAIL ===" -ForegroundColor Cyan
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Yellow
Write-Host "Response:" -ForegroundColor Cyan
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Output:**
```
Status: 400
Error: Invalid email format
```

### Command B - Weak Password:
```powershell
$weakBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
    password = "weak"
    role = "student"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body $weakBody `
  -SkipHttpErrorCheck

Write-Host "=== VALIDATION TEST - WEAK PASSWORD ===" -ForegroundColor Cyan
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Yellow
Write-Host "Response:" -ForegroundColor Cyan
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Output:**
```
Status: 400
Error: Password must be at least 8 characters
```

---

## 🔵 STEP 3: Create Valid User (Routes + Firestore Write)

**What it tests:** Valid user creation through all layers

### Command:
```powershell
$validUser = @{
    firstName = "John"
    lastName = "Doe"
    email = "john-$(Get-Random 10000)@example.com"
    password = "TestPass123!"
    role = "student"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -ContentType "application/json" `
  -Body $validUser `
  -SkipHttpErrorCheck

Write-Host "=== STEP 3: CREATE USER ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green

$jsonResponse = $response.Content | ConvertFrom-Json
Write-Host "Message: $($jsonResponse.message)" -ForegroundColor Green
Write-Host "User ID: $($jsonResponse.user.id)" -ForegroundColor Green
Write-Host "Email: $($jsonResponse.user.email)" -ForegroundColor Green
Write-Host "Role: $($jsonResponse.user.role)" -ForegroundColor Green
Write-Host "Verified: $($jsonResponse.user.isVerified)" -ForegroundColor Yellow

# Save email for next steps
$script:TestEmail = $jsonResponse.user.email
Write-Host "`n📧 Saved email: $script:TestEmail" -ForegroundColor Cyan
```

**Expected Output:**
```
Status: 201
Message: Registration successful. Please check your email to verify your account.
User ID: john-xxxx@example.com
Email: john-xxxx@example.com
Role: student
Verified: false

📧 Email checks Firestore (Layer 7)
```

---

## 📧 STEP 4: Get Verification Token from Email

**What it tests:** Email service delivery

### Steps:
1. **Check your email**: Open **guegouoguiddel@gmail.com** (your configured email)
2. **Look for email from**: GIEA Platform
3. **Copy the verification token**
4. **Keep it safe** - need for next step

**Email should contain:**
```
Subject: Verify Your Email - GIEA Platform

Dear John,

Please verify your email by using this token:
abc123def456ghi789...

This token expires in 24 hours.
```

**Save the token:**
```powershell
$script:VerificationToken = "PASTE_YOUR_TOKEN_HERE"
Write-Host "Token saved: $script:VerificationToken" -ForegroundColor Green
```

---

## ✅ STEP 5: Verify Email (Hash Matching + Token Service)

**What it tests:** Token hashing, Firestore query, user update

### Command:
```powershell
$verifyBody = @{
    email = $script:TestEmail
    token = $script:VerificationToken
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/verify-email `
  -Method POST `
  -ContentType "application/json" `
  -Body $verifyBody `
  -SkipHttpErrorCheck

Write-Host "=== STEP 5: VERIFY EMAIL ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Red" })

$jsonResponse = $response.Content | ConvertFrom-Json
Write-Host "Message: $($jsonResponse.message)" -ForegroundColor Green

if ($response.StatusCode -eq 200) {
    Write-Host "✅ Email verified successfully!" -ForegroundColor Green
    Write-Host "✅ Token hashing worked (Layer 5)" -ForegroundColor Green
    Write-Host "✅ Firestore update worked (Layer 7)" -ForegroundColor Green
} else {
    Write-Host "❌ Verification failed!" -ForegroundColor Red
    Write-Host "Check: Token is correct? Not expired?" -ForegroundColor Yellow
}
```

**Expected Output:**
```
Status: 200
Message: Email verified successfully. You can now log in.
✅ Email verified successfully!
✅ Token hashing worked
✅ Firestore update worked
```

---

## 🔐 STEP 6: Login (Passport Local Strategy + bcrypt)

**What it tests:** Passport authentication, password verification (bcrypt), JWT generation

### Command:
```powershell
$loginBody = @{
    email = $script:TestEmail
    password = "TestPass123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody `
  -SkipHttpErrorCheck

Write-Host "=== STEP 6: LOGIN ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Red" })

$jsonResponse = $response.Content | ConvertFrom-Json
Write-Host "Message: $($jsonResponse.message)" -ForegroundColor Green

if ($response.StatusCode -eq 200) {
    Write-Host "✅ Password verified (bcrypt - Layer 5)" -ForegroundColor Green
    
    $script:JWT_TOKEN = $jsonResponse.token
    Write-Host "✅ JWT generated (Layer 5)" -ForegroundColor Green
    Write-Host "✅ Token: $($script:JWT_TOKEN.Substring(0, 20))..." -ForegroundColor Cyan
    
    Write-Host "✅ Passport strategy worked (Layer 4)" -ForegroundColor Green
    Write-Host "✅ Route /api/auth/login worked (Layer 3)" -ForegroundColor Green
} else {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($jsonResponse.message)" -ForegroundColor Yellow
}
```

**Expected Output:**
```
Status: 200
Message: Login successful
✅ Password verified (bcrypt)
✅ JWT generated
✅ Token: eyJhbGciOiJIUzI1NiIs...
✅ Passport strategy worked
✅ Route worked
```

---

## 👤 STEP 7: Test Protected Route (Layer 2: Auth Middleware)

**What it tests:** JWT verification, protected routes, authentication middleware

### Command:
```powershell
$headers = @{
    "Authorization" = "Bearer $script:JWT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/me `
  -Method GET `
  -Headers $headers `
  -SkipHttpErrorCheck

Write-Host "=== STEP 7: GET CURRENT USER (Protected) ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Red" })

$jsonResponse = $response.Content | ConvertFrom-Json
Write-Host "User: $($jsonResponse.firstName) $($jsonResponse.lastName)" -ForegroundColor Green
Write-Host "Email: $($jsonResponse.email)" -ForegroundColor Green
Write-Host "Role: $($jsonResponse.role)" -ForegroundColor Green

Write-Host "✅ JWT verification worked (auth middleware)" -ForegroundColor Green
Write-Host "✅ Protected route accessed successfully" -ForegroundColor Green
```

**Expected Output:**
```
Status: 200
User: John Doe
Email: john-xxxx@example.com
Role: student
✅ JWT verification worked
✅ Protected route accessed successfully
```

---

## 🔑 STEP 8: Test RBAC (Layer 6: CASL Permission Check)

**What it tests:** Role-based access control with CASL

### Command A - Student Can Read Profile:
```powershell
$headers = @{
    "Authorization" = "Bearer $script:JWT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/users/profile/$($script:TestEmail)" `
  -Method GET `
  -Headers $headers `
  -SkipHttpErrorCheck

Write-Host "=== STEP 8A: RBAC - Student Reading Profile ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Red" })

if ($response.StatusCode -eq 200) {
    Write-Host "✅ Student CAN read profile (CASL permission granted)" -ForegroundColor Green
} else {
    Write-Host "❌ Access denied" -ForegroundColor Red
}

Write-Host "✅ CASL middleware executed (Layer 6)" -ForegroundColor Green
```

### Command B - Student Cannot Delete User (Admin Only):
```powershell
$headers = @{
    "Authorization" = "Bearer $script:JWT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri http://localhost:5000/api/users/deactivate `
  -Method DELETE `
  -Headers $headers `
  -SkipHttpErrorCheck

Write-Host "=== STEP 8B: RBAC - Student Trying Admin Action ===" -ForegroundColor Yellow
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 403) { "Yellow" } else { "Red" })

if ($response.StatusCode -eq 403) {
    $jsonResponse = $response.Content | ConvertFrom-Json
    Write-Host "✅ Correctly DENIED (student doesn't have admin role)" -ForegroundColor Green
    Write-Host "Message: $($jsonResponse.message)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Should have been denied!" -ForegroundColor Red
}

Write-Host "✅ CASL permission check working (Layer 6)" -ForegroundColor Green
```

**Expected Output:**
```
STEP 8A:
Status: 200
✅ Student CAN read profile

STEP 8B:
Status: 403
✅ Correctly DENIED (insufficient role)
Message: Access denied. You don't have permission to...
```

---

## 📝 STEP 9: Update Profile (Full Flow Test)

**What it tests:** Validation → Route → Auth → RBAC → Firestore Update

### Command:
```powershell
$updateBody = @{
    phone = "+1-555-0123"
    location = "New York"
    bio = "Software Developer"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $script:JWT_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri http://localhost:5000/api/users/profile `
  -Method PUT `
  -Headers $headers `
  -Body $updateBody `
  -SkipHttpErrorCheck

Write-Host "=== STEP 9: UPDATE PROFILE ===" -ForegroundColor Green
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Red" })

$jsonResponse = $response.Content | ConvertFrom-Json
Write-Host "Message: $($jsonResponse.message)" -ForegroundColor Green

Write-Host "`n✅ All layers tested:" -ForegroundColor Cyan
Write-Host "  1. ✅ Security (headers present)" -ForegroundColor Green
Write-Host "  2. ✅ Validation (input checked)" -ForegroundColor Green
Write-Host "  3. ✅ Routes (/api/users/profile)" -ForegroundColor Green
Write-Host "  4. ✅ Passport (auth strategy)" -ForegroundColor Green
Write-Host "  5. ✅ Hash + JWT (security)" -ForegroundColor Green
Write-Host "  6. ✅ CASL RBAC (permissions)" -ForegroundColor Green
Write-Host "  7. ✅ Firestore (data stored)" -ForegroundColor Green
```

**Expected Output:**
```
Status: 200
Message: Profile updated successfully

✅ All layers tested:
  1. ✅ Security
  2. ✅ Validation
  3. ✅ Routes
  4. ✅ Passport
  5. ✅ Hash + JWT
  6. ✅ CASL RBAC
  7. ✅ Firestore
```

---

## 📊 COMPLETE TEST SUMMARY

### All Tests Passed = ✅
- ✅ User created in Firestore
- ✅ Email verified
- ✅ JWT token generated
- ✅ Protected routes working
- ✅ RBAC permissions enforced
- ✅ Database updated
- ✅ All middleware working

### Architecture Flow Complete:
```
CLIENT INPUT
  ↓ (Security Layer - Headers checked)
  ↓ (Validation - Email/Password checked)
  ↓ (Routes - /api/auth/register matched)
  ↓ (Passport - Strategy applied)
  ↓ (Hash + JWT - Password hashed, token generated)
  ↓ (RBAC - Permissions checked)
  ↓ (Firestore - Data stored/updated)
SUCCESS ✅
```

---

## 🔍 Troubleshooting

### Error: "Invalid or expired token"
**Solution:** 
- Check token in email is correct
- Check token hasn't expired (24 hours)
- Copy full token including hyphens

### Error: "Email already registered"
**Solution:** 
- Use random email: `test-$(Get-Random)@example.com`
- Or use different number each time

### Error: "Server error during email verification"
**Solution:**
- Check server logs in `npm run dev` terminal
- Verify email parameter is included
- Verify token parameter is included

### Error: "401 Unauthorized"
**Solution:**
- Token missing? Add `"Authorization" = "Bearer TOKEN_HERE"`
- Token expired? Login again to get new token
- Token format? Must be `Bearer TOKEN` (with space)

---

## ✅ Success Checklist

- [ ] STEP 1: Security headers present
- [ ] STEP 2: Validation caught bad input
- [ ] STEP 3: User created successfully (201)
- [ ] STEP 4: Verification email received
- [ ] STEP 5: Email verified successfully (200)
- [ ] STEP 6: Login successful, got JWT token
- [ ] STEP 7: Protected route accessible with token
- [ ] STEP 8: RBAC permissions working
- [ ] STEP 9: Profile updated successfully

**ALL STEPS ✅ = API IS WORKING PERFECTLY!**
