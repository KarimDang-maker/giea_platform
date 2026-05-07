# Fixes Applied - Skills, Documents & Avatar

## Summary of Changes

All user management features (Skills, Documents, Avatar) have been moved to the **Authentication Module** following your modular architecture pattern.

## Files Created/Modified

### 1. **Authentication Module - User Controller**
- **File**: `src/modules/authentication/controllers/user.controller.js` (NEW)
- **Contains**: All profile, avatar, preferences, skills, and documents CRUD operations
- **Key Improvements**:
  - Added `getSkill()` method to retrieve individual skills by ID
  - Enhanced error handling for Firebase storage operations
  - Better error messages for debugging

### 2. **Authentication Module - User Routes**
- **File**: `src/modules/authentication/routes/user.routes.js` (NEW)
- **Features**: Complete REST API routes for:
  - Profile management (`/profile`, `/profile/:userId`)
  - Avatar upload (`/avatar`) - now accepts ANY image format
  - Preferences (`/preferences`)
  - Password management (`/change-password`)
  - Skills CRUD (`/skills`, `/skills/:skillId`)
  - Documents CRUD (`/documents`, `/documents/:documentId`)
  - User search (`/search`)
  - Account management (`/deactivate`)

### 3. **User Model - Skills & Documents Arrays**
- **File**: `src/modules/authentication/models/user.model.js`
- **Changes**:
  - Added `skills` array to constructor with default empty array
  - Added `documents` array to constructor with default empty array
  - Updated `save()` method to persist these arrays to Firestore
  - Skills and documents are now properly saved when updated

### 4. **Main App Configuration**
- **File**: `src/index.js`
- **Change**: Updated to import user routes from authentication module instead of root level

### 5. **File Upload Configuration**
- **File**: `src/config/multer.js`
- **Change**: Avatar now accepts ANY image type using `file.mimetype.startsWith('image/')`

## API Endpoints

All endpoints are prefixed with `/api`:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

### User Profile
- `GET /users/profile/:userId` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/avatar` - Upload avatar (any image format)
- `PUT /users/preferences` - Update preferences
- `POST /users/change-password` - Change password
- `GET /users/search?q=keyword&role=student` - Search users
- `DELETE /users/deactivate` - Deactivate account

### User Skills
- `GET /users/skills` - Get all skills
- `POST /users/skills` - Add skill
- `GET /users/skills/:skillId` - Get specific skill ⭐ NEW
- `PUT /users/skills/:skillId` - Update skill
- `DELETE /users/skills/:skillId` - Delete skill

### User Documents
- `GET /users/documents` - Get all documents
- `POST /users/documents` - Upload document
- `PUT /users/documents/:documentId` - Update document info
- `DELETE /users/documents/:documentId` - Delete document

## Testing

### 1. Create a Skill
```bash
curl -X POST http://localhost:5000/api/users/skills \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "level": "Expert",
    "yearsOf": 5,
    "category": "Programming"
  }'
```

### 2. Get All Skills
```bash
curl -X GET http://localhost:5000/api/users/skills \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get Specific Skill
```bash
curl -X GET http://localhost:5000/api/users/skills/skill-1775872787014 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Update a Skill
```bash
curl -X PUT http://localhost:5000/api/users/skills/skill-1775872787014 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "level": "Senior",
    "yearsOf": 6
  }'
```

### 5. Upload Document
```bash
curl -X POST http://localhost:5000/api/users/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf" \
  -F "documentType=resume"
```

### 6. Upload Avatar (ANY image format)
```bash
curl -X POST http://localhost:5000/api/users/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@profile.jpg"
  
# Works with: JPG, PNG, GIF, WebP, TIFF, BMP, SVG, etc.
```

## Firebase Configuration

### Issue: "The specified bucket does not exist"

This error means your Firebase Storage bucket is not configured correctly.

#### Fix:

1. Go to Google Firebase Console: https://console.firebase.google.com/
2. Select your project: `giea-c40d6`
3. Go to **Storage** section
4. Get your **Storage Bucket** URL (should look like: `giea-c40d6.appspot.com`)
5. Update `.env` file:

```env
FIREBASE_PROJECT_ID=giea-c40d6
FIREBASE_STORAGE_BUCKET=giea-c40d6.appspot.com
FIREBASE_PRIVATE_KEY=your_key_from_firebase
FIREBASE_CLIENT_EMAIL=your_email_from_firebase
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
```

### To Get Firebase Admin Credentials:

1. Go to Firebase Console → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Copy the JSON file contents:
   - `FIREBASE_PRIVATE_KEY` → copy `private_key` value
   - `FIREBASE_CLIENT_EMAIL` → copy `client_email` value
   - `FIREBASE_CLIENT_ID` → copy `client_id` value

## Architecture Pattern

The modular structure allows each module to be independent:

```
src/
├── modules/
│   ├── authentication/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js (NEW)
│   │   │   └── index.js
│   │   ├── models/
│   │   │   └── user.model.js (UPDATED)
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js (NEW)
│   │   │   └── index.js
│   │   └── middleware/
│   ├── [other-modules]/ (following same pattern)
```

**Other modules can follow this exact pattern for their features.**

## Troubleshooting

### Skills not persisting after add?
- Check that Firestore database is initialized
- Verify `FIREBASE_PROJECT_ID` in .env
- Check browser console for actual error messages

### Document upload fails with 500?
- Check Firebase Storage bucket is created in console
- Verify `FIREBASE_STORAGE_BUCKET` format: `bucket-name.appspot.com`
- Check Firebase service account has storage permissions

### Avatar upload fails?
- Ensure file is an image (any format now accepted)
- Check file size is under 10MB
- Verify Firebase Storage bucket exists

## Next Steps

1. **Update .env** with correct Firebase credentials
2. **Test each endpoint** using Swagger or curl
3. **Other modules**: Follow the same pattern for your features
4. **Database**: Create Firestore indexes if queries are slow

For any issues, check the server logs for detailed error messages.
