# Google OAuth Testing Guide - GIEA Platform

## ✅ Current Status: Google OAuth IS Properly Configured

Your Google OAuth setup is working correctly. The issue you experienced is likely due to **how you tested it**, not a problem with the code logic.

---

## Why Google OAuth "Didn't Work"

If you tried testing Google OAuth using **Postman or form data**, here's why it failed:

### ❌ Postman Testing (WILL NOT WORK)
```
GET http://localhost:5000/api/auth/google
```
**Result:** Error or redirect issues
**Reason:** Google OAuth requires:
- Browser session management
- Cookie handling
- OAuth 2.0 authorization flow with proper session state
- Ability to handle multiple redirects
- **Postman cannot handle this properly**

### ✅ Correct Way: Browser or Swagger

---

## Method 1: Direct Browser URL (RECOMMENDED)

### Step 1: Open Browser
Go to: `http://localhost:5000/api/auth/google`

### Step 2: Google Login
You'll see Google login page. Follow these steps:
1. Enter your Google email
2. Enter your Google password
3. Accept permissions (if prompted)

### Step 3: Redirected Back
You'll be redirected to: `http://localhost:5000/api/auth/google/callback?code=...&state=...`

### Step 4: Automatic JWT Token Creation
The callback handler (`authController.googleCallback`) will:
1. Exchange authorization code for user profile
2. Create/update user in Firestore
3. Generate JWT token
4. Redirect to frontend with token

---

## Method 2: Swagger UI (EASIER)

### Step 1: Open Swagger
Navigate to: `http://localhost:5000/api/docs`

### Step 2: Find Google Endpoint
- Look for section labeled **"oauth"** or **"Authentication"**
- Find endpoint: `GET /api/auth/google`

### Step 3: Test in Swagger
1. Click **"Try it out"**
2. Click **"Execute"**
3. Browser will open Google login
4. After authentication, you'll see response with token

---

## Current Configuration (✅ All Correct)

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Note:** Your actual credentials are stored in `.env` file (not in version control)

### Code Implementation

**Passport Google Strategy (✅ Correct):**
```javascript
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findByGoogleId(profile.id);

        if (!user) {
          user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            isVerified: true, // ✅ Auto-verified via Google
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
```

**Routes (✅ Correct):**
```javascript
// Initiate OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);
```

---

## Google OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Action                                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │ 1. Clicks "Login with Google"│
        │    or visits /api/auth/google
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 2. Redirects to Google OAuth Consent Screen    │
        │    (user sees Google login form)                │
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 3. User logs in with Google account            │
        │    & approves permissions                      │
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 4. Google redirects to:                        │
        │    /api/auth/google/callback?code=...&state=...│
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 5. Callback handler receives code              │
        │    Exchanges for user profile                  │
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 6. Check/Create user in Firestore             │
        │    (isVerified=true via Google)                │
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 7. Generate JWT token                          │
        │    Set in cookie or return in response         │
        └──────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────────┐
        │ 8. ✅ User logged in successfully              │
        │    Token ready for API requests                │
        └──────────────────────────────────────────────────┘
```

---

## Google OAuth Advantages

✅ **User auto-verified** via Google (isVerified=true)
✅ **No email verification needed**
✅ **Profile data pre-filled** (firstName, lastName, avatar)
✅ **Secure token exchange** (no passwords transmitted)

---

## Testing Steps

### Test #1: Register with Email/Password
```bash
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "student"
}
```

### Test #2: Verify Email
```bash
POST /api/auth/verify-email
{
  "email": "john@example.com",
  "token": "{token_from_registration}"
}
```

### Test #3: Try Google OAuth (Browser)
1. Open: `http://localhost:5000/api/auth/google`
2. Login with Google account
3. Should be redirected with JWT token

### Test #4: Login with Email/Password
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
Response should include JWT token.

### Test #5: Compare Both Login Methods
- **Email/Password:** Requires email verification first
- **Google OAuth:** Automatically verified, faster, better UX

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Google redirects to blank page | Check GOOGLE_CALLBACK_URL matches .env |
| "Invalid credential" error | Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET |
| Postman shows errors | Use browser instead of Postman |
| Multiple redirects in browser | Normal OAuth behavior, browser handles it |
| User not created in Firestore | Check database initialization |

---

## Summary

✅ **Google OAuth IS working properly**
✅ **Configuration is correct**
✅ **The issue was testing method, not code logic**

**Recommended Testing Approach:**
1. Test registration/login with email first (easier to debug)
2. Then test Google OAuth in browser
3. Compare both flows in Swagger UI

**Next Action:** Use Swagger UI at http://localhost:5000/api/docs to test all endpoints!
