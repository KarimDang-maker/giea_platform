# Profile Management Module - Complete Implementation Guide

## 📋 Overview

The Profile Management system is now fully implemented with:
- ✅ **Profile Creation/Modification** (bio, company, location, website, specialization, years of experience)
- ✅ **Avatar Upload** (NOW FIXED with multer)
- ✅ **Skills & Interests Management** (add, edit, remove skills)
- ✅ **Document Upload & Management** (CV, certificates, portfolios, etc.)
- ✅ **User Preferences** (notifications, privacy settings)
- ✅ **Account Security** (password change, account deactivation)

---

## 🏗️ Architecture - How It Works

### Data Model Structure

```javascript
User Document in Firestore
├── Basic Info
│   ├── firstName
│   ├── lastName
│   ├── email
│   ├── phone
│   └── avatar (URL to Firebase Storage)
│
├── Profile (Nested Object)
│   ├── bio (string) - Personal description
│   ├── company (string) - Current company
│   ├── location (string) - City/Country
│   ├── website (string) - Portfolio/website URL
│   ├── specialization (string) - Career focus area
│   └── yearsOfExperience (number) - Total experience
│
├── Skills Array
│   └── [
│       {
│         id: "skill-1710000000000",
│         name: "JavaScript",
│         level: "Expert", // Beginner|Intermediate|Advanced|Expert
│         yearsOf: 5,
│         category: "Programming",
│         addedAt: Date,
│         updatedAt: Date (optional)
│       },
│       ...
│     ]
│
├── Documents Array
│   └── [
│       {
│         id: "doc-1710000000000",
│         name: "Resume",
│         type: "resume", // resume|certificate|portfolio|etc
│         url: "https://...", // Signed Firebase Storage URL
│         mimeType: "application/pdf",
│         fileSize: 245000,
│         firebaseStoragePath: "documents/user@email.com/resume-...",
│         uploadedAt: Date,
│         updatedAt: Date (optional)
│       },
│       ...
│     ]
│
└── Other fields (verified, preferences, timestamps, etc.)
```

---

## 🔧 What Was Fixed - Avatar Upload

### The Problem ❌
The avatar endpoint existed but failed because:
- **No multer middleware configured**
- `req.file` was undefined
- File upload wasn't being processed

### The Solution ✅
1. **Installed multer** - File upload middleware
2. **Created multer config** (`src/config/multer.js`) with:
   - Memory storage (faster, uploads directly to Firebase)
   - File type validation (only images for avatar)
   - File size limits (10MB max)
3. **Added multer middleware** to avatar route
4. Now avatar uploads work perfectly to Firebase Storage

---

## 📚 Complete API Endpoints

### 1. Profile Management

#### GET /api/users/profile/:userId
**Get any user's public profile**
```bash
GET http://localhost:5000/api/users/profile/john@example.com
Authorization: Bearer {token}
```

**Response:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "student",
  "avatar": "https://...",
  "profile": {
    "bio": "Software developer passionate about web tech",
    "company": "Tech Corp",
    "location": "New York, USA",
    "website": "https://johndoe.com",
    "specialization": "Full Stack Development",
    "yearsOfExperience": 5
  },
  "skills": [...],
  "documents": [...]
}
```

#### PUT /api/users/profile
**Update your profile information**
```bash
PUT http://localhost:5000/api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Updated bio here",
  "company": "New Company",
  "location": "San Francisco",
  "website": "https://newsite.com",
  "specialization": "AI/ML",
  "yearsOfExperience": 6
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

---

### 2. Avatar Upload (NOW FIXED ✅)

#### POST /api/users/avatar
**Upload profile photo**

**How to test in Swagger:**
1. Go to http://localhost:5000/api/docs
2. Find `POST /api/users/avatar` under Users
3. Click "Try it out"
4. Click "Select file" and choose an image (JPG, PNG, GIF, WebP)
5. Click "Execute"

**How to test with cURL:**
```bash
curl -X POST http://localhost:5000/api/users/avatar \
  -H "Authorization: Bearer {token}" \
  -F "avatar=@/path/to/image.jpg"
```

**How to test with Postman:**
1. Method: POST
2. URL: http://localhost:5000/api/users/avatar
3. Headers: Authorization: Bearer {token}
4. Body: form-data
   - Key: "avatar" (type: File)
   - Select: (choose image file)
5. Send

**Response (200 OK):**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://storage.googleapis.com/... (signed URL)"
}
```

**Allowed file types:** JPEG, PNG, GIF, WebP
**Max file size:** 10MB

---

### 3. Skills Management

#### GET /api/users/skills
**Get all your skills**
```bash
GET http://localhost:5000/api/users/skills
Authorization: Bearer {token}
```

**Response:**
```json
{
  "skills": [
    {
      "id": "skill-1710000000000",
      "name": "JavaScript",
      "level": "Expert",
      "yearsOf": 5,
      "category": "Programming",
      "addedAt": "2024-03-01T10:00:00Z"
    },
    {
      "id": "skill-1710000001000",
      "name": "React",
      "level": "Advanced",
      "yearsOf": 3,
      "category": "Frontend",
      "addedAt": "2024-03-01T10:00:00Z"
    }
  ],
  "total": 2
}
```

#### POST /api/users/skills
**Add a new skill**
```bash
POST http://localhost:5000/api/users/skills
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "JavaScript",
  "level": "Expert",
  "yearsOf": 5,
  "category": "Programming"
}
```

**Response (201 Created):**
```json
{
  "message": "Skill added successfully",
  "skill": {
    "id": "skill-1710000000000",
    "name": "JavaScript",
    "level": "Expert",
    "yearsOf": 5,
    "category": "Programming",
    "addedAt": "2024-03-01T10:00:00Z"
  }
}
```

#### PUT /api/users/skills/:skillId
**Update a skill**
```bash
PUT http://localhost:5000/api/users/skills/skill-1710000000000
Authorization: Bearer {token}
Content-Type: application/json

{
  "level": "Advanced",  // Update level
  "yearsOf": 6         // Update years experience
}
```

**Response (200 OK):**
```json
{
  "message": "Skill updated successfully",
  "skill": {
    "id": "skill-1710000000000",
    "name": "JavaScript",
    "level": "Advanced",
    "yearsOf": 6,
    "category": "Programming",
    "updatedAt": "2024-03-01T11:00:00Z"
  }
}
```

#### DELETE /api/users/skills/:skillId
**Remove a skill**
```bash
DELETE http://localhost:5000/api/users/skills/skill-1710000000000
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Skill removed successfully"
}
```

---

### 4. Documents Management

#### GET /api/users/documents
**Get all your documents**
```bash
GET http://localhost:5000/api/users/documents
Authorization: Bearer {token}
```

**Response:**
```json
{
  "documents": [
    {
      "id": "doc-1710000000000",
      "name": "Resume",
      "type": "resume",
      "url": "https://storage.googleapis.com/...",
      "mimeType": "application/pdf",
      "fileSize": 245000,
      "uploadedAt": "2024-03-01T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### POST /api/users/documents
**Upload a document**

**How to test in Swagger:**
1. Go to http://localhost:5000/api/docs
2. Find `POST /api/users/documents` under Documents
3. Click "Try it out"
4. Select file (PDF, Word, Excel, PowerPoint)
5. Add documentType (optional): "resume", "certificate", "portfolio", etc.
6. Click "Execute"

**With cURL:**
```bash
curl -X POST http://localhost:5000/api/users/documents \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/resume.pdf" \
  -F "documentType=resume"
```

**Response (201 Created):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "doc-1710000000000",
    "name": "Resume",
    "type": "resume",
    "url": "https://storage.googleapis.com/...",
    "mimeType": "application/pdf",
    "fileSize": 245000,
    "uploadedAt": "2024-03-01T10:00:00Z"
  }
}
```

**Allowed file types:** 
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)
- Text (.txt)

**Max file size:** 10MB

#### PUT /api/users/documents/:documentId
**Update document information (rename or change type)**
```bash
PUT http://localhost:5000/api/users/documents/doc-1710000000000
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Resume 2024",
  "type": "resume"
}
```

**Response (200 OK):**
```json
{
  "message": "Document info updated successfully",
  "document": {
    "id": "doc-1710000000000",
    "name": "Updated Resume 2024",
    "type": "resume",
    ...
  }
}
```

#### DELETE /api/users/documents/:documentId
**Remove a document**
```bash
DELETE http://localhost:5000/api/users/documents/doc-1710000000000
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Document removed successfully"
}
```

---

### 5. Other Profile Features

#### PUT /api/users/preferences
**Update notification preferences and privacy settings**
```bash
PUT http://localhost:5000/api/users/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": false,
  "privateProfile": false  // If true, profile is hidden from search
}
```

#### POST /api/users/change-password
**Change your password**
```bash
POST http://localhost:5000/api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

## 🧪 Complete Testing Workflow

### Step 1: Register & Login
```bash
# 1. Register
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "student"
}

# 2. Verify email
POST /api/auth/verify-email (use token from email/console)

# 3. Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
→ Get JWT token: "eyJhbGciOiJIUzI1NiIs..."
```

### Step 2: Update Basic Profile
```bash
PUT /api/users/profile
{
  "firstName": "John",
  "bio": "Full stack developer",
  "company": "Tech Corp",
  "location": "NYC",
  "yearsOfExperience": 5
}
```

### Step 3: Upload Avatar
```bash
POST /api/users/avatar
[select profile_photo.jpg]
```

### Step 4: Add Skills
```bash
# Add skill 1
POST /api/users/skills
{
  "name": "JavaScript",
  "level": "Expert",
  "yearsOf": 5,
  "category": "Programming"
}

# Add skill 2
POST /api/users/skills
{
  "name": "React",
  "level": "Advanced",
  "yearsOf": 3,
  "category": "Frontend"
}

# View all skills
GET /api/users/skills
```

### Step 5: Upload Documents
```bash
# Upload resume
POST /api/users/documents
[select resume.pdf]
documentType: resume

# Upload certificate
POST /api/users/documents
[select certificate.pdf]
documentType: certificate

# View all documents
GET /api/users/documents
```

### Step 6: View Complete Profile
```bash
GET /api/users/profile/john@example.com
→ Returns everything: bio, skills, documents, avatar, etc.
```

---

## 📁 File Organization

```
src/
├── config/
│   ├── multer.js (NEW - File upload configuration)
│   ├── database.js
│   ├── passport.js
│   └── swagger.js
│
├── models/
│   └── user.model.js (UPDATED - Added skills & documents arrays)
│
├── controllers/
│   └── user.controller.js (UPDATED - Added 7 new methods)
│       ├── addSkill
│       ├── updateSkill
│       ├── removeSkill
│       ├── getSkills
│       ├── uploadDocument
│       ├── removeDocument
│       ├── getDocuments
│       └── updateDocumentInfo
│
└── routes/
    └── user.routes.js (UPDATED - Fixed avatar, added 9 new routes)
        ├── POST /avatar (NOW FIXED ✅)
        ├── GET /skills
        ├── POST /skills
        ├── PUT /skills/:skillId
        ├── DELETE /skills/:skillId
        ├── GET /documents
        ├── POST /documents
        ├── PUT /documents/:documentId
        └── DELETE /documents/:documentId
```

**No new module folder needed** - Everything integrated into existing user management structure!

---

## 🎯 Key Features

### 1. Smart File Handling
- Uses **Firebase Storage** for reliable cloud storage
- Generates **signed URLs** for secure document access
- Automatic cleanup when documents deleted
- Different file type validation for avatars vs documents

### 2. Data Organization
- Skills stored in array with unique IDs
- Documents with full metadata (size, type, upload date)
- Supports multiple documents per user
- Efficient Firestore queries

### 3. Security
- Only authenticated users can upload
- File type & size validation
- Role-based access control
- Signed URLs (limited expiration on avatars)

### 4. User Experience
- Simple REST API
- Clear error messages
- Swagger documentation for all endpoints
- No module duplication

---

## ✅ Testing Checklist

- [ ] Avatar upload works (test in Swagger with image file)
- [ ] Skills: Add, Edit, Delete, View
- [ ] Documents: Upload, Rename, Delete, View
- [ ] Profile update: bio, company, location
- [ ] Verify avatar appears in GET profile
- [ ] Verify skills array populated
- [ ] Verify documents with URLs accessible
- [ ] Test privacy settings work
- [ ] Test with different file types

---

## 🚀 Next Steps (Optional Enhancements)

1. **Skill endorsements** - Users can endorse each other's skills
2. **Document sharing** - Share specific documents with other users
3. **Bulk document upload** - Upload multiple files at once
4. **Photo gallery** - Additional profile photos
5. **Work experience** - Timeline of past companies
6. **Education history** - School/degree information

All can be added without changing the current module structure!
