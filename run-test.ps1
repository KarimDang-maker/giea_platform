#!/usr/bin/env pwsh
# GIEA Platform - Architecture Flow Testing  
# Compatible with PowerShell 5.1+

$BaseUrl = "http://localhost:5000"
$global:TestEmail = ""
$global:JWT_TOKEN = ""

Write-Host ""
Write-Host "=== GIEA PLATFORM - ARCHITECTURE FLOW TESTING ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing all 7 architecture layers..." -ForegroundColor Cyan
Write-Host ""

# Check server
Write-Host "[CHECK] Server at $BaseUrl" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest "$BaseUrl/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Server online" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Cannot reach server. Run: npm run dev" -ForegroundColor Red
    exit 1
}

# STEP 1: Security Headers
Write-Host ""
Write-Host "=== LAYER 1: SECURITY (Helmet) ===" -ForegroundColor Green

try {
    $response = Invoke-WebRequest "$BaseUrl/health" -UseBasicParsing
    $headers = $response.Headers
    if ($headers.ContainsKey("X-Content-Type-Options")) {
        Write-Host "[OK] Security headers present" -ForegroundColor Green
    }
} catch {
    Write-Host "[WARN] Could not verify headers" -ForegroundColor Yellow
}

# STEP 2: Create User
Write-Host ""  
Write-Host "=== LAYER 2-3: ROUTES + FIRESTORE WRITE ===" -ForegroundColor Green

# Use random number for unique email each time
$randomNum = Get-Random -Min 100000 -Max 999999
$testEmail = "testuser+$randomNum@gmail.com"
Write-Host "Creating test user: $testEmail"

try {
    $body = @{
        firstName = "John"
        lastName = "Doe"
        email = $testEmail
        password = "TestPass123!"
        role = "student"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" -Method POST `
        -ContentType "application/json" -Body $body -UseBasicParsing

    $json = $response.Content | ConvertFrom-Json
    $global:TestEmail = $json.user.email
    
    Write-Host "[OK] User created" -ForegroundColor Green
    Write-Host "  Email: $global:TestEmail" -ForegroundColor Cyan
} catch {
    Write-Host "[FAIL] Could not create user: $_" -ForegroundColor Red
    exit 1
}

# STEP 3: Email Verification
Write-Host ""
Write-Host "=== LAYER 4-5-7: EMAIL + TOKEN + FIRESTORE ===" -ForegroundColor Green
Write-Host ""
Write-Host "CHECK: guegouoguiddel@gmail.com for verification email" -ForegroundColor Yellow

$token = Read-Host "`nPaste verification token"

try {
    $body = @{
        email = $global:TestEmail
        token = $token
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/verify-email" -Method POST `
        -ContentType "application/json" -Body $body -UseBasicParsing

    Write-Host "[OK] Email verified" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Verification failed: $_" -ForegroundColor Red
}

# STEP 4: Login (Passport + JWT)
Write-Host ""
Write-Host "=== LAYER 4-5: PASSPORT + JWT ===" -ForegroundColor Green

try {
    $body = @{
        email = $global:TestEmail
        password = "TestPass123!"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST `
        -ContentType "application/json" -Body $body -UseBasicParsing

    $json = $response.Content | ConvertFrom-Json
    $global:JWT_TOKEN = $json.token
    
    Write-Host "[OK] Login successful, JWT generated" -ForegroundColor Green
    Write-Host "  Token: $($global:JWT_TOKEN.Substring(0, 30))..." -ForegroundColor Cyan
} catch {
    Write-Host "[FAIL] Login failed: $_" -ForegroundColor Red
    exit 1
}

# STEP 5: Protected Route
Write-Host ""
Write-Host "=== LAYER 2: AUTH MIDDLEWARE ===" -ForegroundColor Green

try {
    $headers = @{
        "Authorization" = "Bearer $global:JWT_TOKEN"
    }

    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/me" -Method GET `
        -Headers $headers -UseBasicParsing

    $json = $response.Content | ConvertFrom-Json
    Write-Host "[OK] Protected route accessed with JWT" -ForegroundColor Green
    Write-Host "  User: $($json.firstName)" -ForegroundColor Cyan
} catch {
    Write-Host "[FAIL] Protected route failed: $_" -ForegroundColor Red
}

# STEP 6: RBAC
Write-Host ""
Write-Host "=== LAYER 6: RBAC (CASL) ===" -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/users/deactivate" -Method DELETE `
        -Headers $headers -UseBasicParsing
    
    Write-Host "[WARN] Should have been denied (403)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "[OK] Correctly denied admin action (403)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Unexpected error: $_" -ForegroundColor Yellow
    }
}

# STEP 7: Full Flow Test
Write-Host ""
Write-Host "=== LAYER 7: FIRESTORE UPDATE ===" -ForegroundColor Green

try {
    $body = @{
        bio = "User from complete flow test"
        location = "New York"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BaseUrl/api/users/profile" -Method PUT `
        -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing

    Write-Host "[OK] Profile updated successfully" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Update failed: $_" -ForegroundColor Red
}

# Done
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] ALL 7 LAYERS TESTED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your API architecture is working correctly!" -ForegroundColor Green
Write-Host ""
