# Visual Guide - Profile Management Flow

## 🎯 User Journey - Complete Profile Creation

```
START: New User Registration
  │
  ├─ POST /api/auth/register
  │  └─ User created, needs email verification
  │
  ├─ POST /api/auth/verify-email  
  │  └─ Email verified, can now login
  │
  ├─ POST /api/auth/login
  │  └─ Get JWT Token ──┐
  │                     │
  ├─────────────────────┘
  │
  ├─ PROFILE BUILDING (All endpoints now available)
  │  │
  │  ├─ PUT /api/users/profile
  │  │  └─ Set bio, company, location, experience
  │  │     ✏️ Example response:
  │  │     {
  │  │       "firstName": "John",
  │  │       "profile": {
  │  │         "bio": "Full stack developer",
  │  │         "company": "Tech Corp",
  │  │         "yearsOfExperience": 5
  │  │       }
  │  │     }
  │  │
  │  ├─ POST /api/users/avatar ⭐ (FIXED NOW)
  │  │  └─ Upload profile photo (JPG/PNG/GIF)
  │  │     📸 Stored in Firebase Storage
  │  │     ✏️ Example response:
  │  │     {
  │  │       "message": "Avatar uploaded successfully",
  │  │       "avatar": "https://storage.googleapis.com/..."
  │  │     }
  │  │
  │  ├─ POST /api/users/skills (NEW)
  │  │  └─ Add first skill
  │  │     ✏️ Request:
  │  │     {
  │  │       "name": "JavaScript",
  │  │       "level": "Expert",
  │  │       "yearsOf": 5,
  │  │       "category": "Programming"
  │  │     }
  │  │     ✏️ Response:
  │  │     {
  │  │       "skill": {
  │  │         "id": "skill-1710000000000",
  │  │         "name": "JavaScript",
  │  │         "level": "Expert",
  │  │         "yearsOf": 5,
  │  │         "category": "Programming",
  │  │         "addedAt": "2024-03-01T10:00:00Z"
  │  │       }
  │  │     }
  │  │
  │  ├─ POST /api/users/skills (again)
  │  │  └─ Add more skills (React, Python, etc.)
  │  │
  │  ├─ POST /api/users/documents (NEW)
  │  │  └─ Upload CV/Resume
  │  │     📄 File validated (PDF, Word, Excel)
  │  │     ✏️ Request: form-data
  │  │        file: resume.pdf
  │  │        documentType: resume
  │  │     ✏️ Response:
  │  │     {
  │  │       "document": {
  │  │         "id": "doc-1710000000000",
  │  │         "name": "resume",
  │  │         "type": "resume",
  │  │         "url": "https://storage.googleapis.com/...",
  │  │         "fileSize": 245000,
  │  │         "uploadedAt": "2024-03-01T10:00:00Z"
  │  │       }
  │  │     }
  │  │
  │  ├─ POST /api/users/documents (again)
  │  │  └─ Upload certificates, portfolio, etc.
  │  │
  │  └─ PUT /api/users/preferences
  │     └─ Set privacy & notification settings
  │
  ├─ VIEW COMPLETE PROFILE
  │  │
  │  └─ GET /api/users/profile/john@example.com
  │     └─ Returns EVERYTHING:
  │        {
  │          "firstName": "John",
  │          "avatar": "https://...",
  │          "profile": {
  │            "bio": "Full stack...",
  │            "company": "Tech Corp",
  │            "yearsOfExperience": 5
  │          },
  │          "skills": [
  │            { "name": "JavaScript", "level": "Expert", ... },
  │            { "name": "React", "level": "Advanced", ... }
  │          ],
  │          "documents": [
  │            { \"name\": \"Resume\", \"url\": \"https://...\", ... },
  │            { \"name\": \"Certificate\", \"url\": \"https://...\", ... }
  │          ]
  │        }
  │
  └─ PROFILE COMPLETE ✅
     Ready to be discovered by other users
```

---

## 🔄 Skills Management Flow

```
Add Skill              Update Skill           Remove Skill
     │                    │                       │
POST /skills ──────→ PUT /skills/:id ────→ DELETE /skills/:id
     │                    │                       │
     │                    │                       │
 Check auth          Check auth              Check auth
     │                    │                       │
     ↓                    ↓                       ↓
Validate name        Validate fields         Find skill in array
     │                    │                       │
     ↓                    ↓                       ↓
Create skill ID      Update properties       Remove from array
     │                    │                       │
     ↓                    ↓                       ↓
Add to user.skills   Update in Firestore     Update in Firestore
     │                    │                       │
     ↓                    ↓                       ↓
Return skill        Return updated skill    Return success

GET /skills → Returns all skills array
```

---

## 📄 Documents Management Flow

```
Upload Document         Update Info            Delete Document
       │                    │                        │
POST /documents ───→ PUT /documents/:id ────→ DELETE /documents/:id
       │                    │                        │
   Check auth          Check auth                Check auth
       │                    │                        │
       ↓                    ↓                        ↓
Validate file        Update name/type         Find document
   (size, type)           │                        │
       │                    ↓                        ↓
   Multer ←          Update in Firestore    Delete from Firestore
   processes             │                        │
       │                    ↓                        ↓
       ↓                Return updated       Delete from Firebase
Firebase Storage     document                     Storage
       │                                           │
       ↓                                           ↓
Generate signed URL              Optional: Clean up file
       │
       ↓
Store metadata in Firestore
       │
       ↓
Return to user

GET /documents → Returns all documents array
```

---

## 📊 Database Structure Visualization

```
Firestore Collection: users
│
└─ Document: john@example.com
   │
   ├─ firstName: "John"
   ├─ lastName: "Doe"
   ├─ email: "john@example.com"
   ├─ password: "$2b$10$..." (hashed)
   ├─ phone: "+1234567890"
   ├─ avatar: "https://storage.googleapis.com/..." ← Firebase Storage URL
   ├─ role: "student"
   │
   ├─ profile: (object)
   │  │
   │  ├─ bio: "Full stack developer passionate about web tech"
   │  ├─ company: "Tech Corp"
   │  ├─ location: "New York, USA"
   │  ├─ website: "https://johndoe.com"
   │  ├─ specialization: "Full Stack Development"
   │  └─ yearsOfExperience: 5
   │
   ├─ skills: (array)
   │  │
   │  ├─ [0]: {
   │  │   id: "skill-1710000000000",
   │  │   name: "JavaScript",
   │  │   level: "Expert",
   │  │   yearsOf: 5,
   │  │   category: "Programming",
   │  │   addedAt: Timestamp
   │  │ }
   │  │
   │  └─ [1]: {
   │      id: "skill-1710000001000",
   │      name: "React",
   │      level: "Advanced",
   │      yearsOf: 3,
   │      category: "Frontend",
   │      addedAt: Timestamp
   │    }
   │
   ├─ documents: (array)
   │  │
   │  └─ [0]: {
   │      id: "doc-1710000000000",
   │      name: "Resume",
   │      type: "resume",
   │      url: "https://storage.googleapis.com/...",
   │      mimeType: "application/pdf",
   │      fileSize: 245000,
   │      firebaseStoragePath: "documents/john@example.com/resume-...",
   │      uploadedAt: Timestamp
   │    }
   │
   ├─ preferences: (object)
   │  ├─ emailNotifications: true
   │  ├─ smsNotifications: false
   │  └─ privateProfile: false
   │
   ├─ isVerified: true
   ├─ isActive: true
   ├─ createdAt: Timestamp
   └─ updatedAt: Timestamp
```

---

## 🔐 Authentication + Profile Flow

```
┌─────────────────────────────────────────────────┐
│           AUTHENTICATION & PROFILE              │
└─────────────────────────────────────────────────┘

STEP 1: User Registers
 │
 │  POST /api/auth/register
 │  {email, password, firstName, lastName, role}
 │         ↓
 │    ✉️  Email sent
 │         ↓
 │  User receives verification link
 │
 └─→ User status: REGISTERED, UNVERIFIED

STEP 2: User Verifies Email
 │
 │  POST /api/auth/verify-email
 │  {email, token}
 │         ↓
 │    Token validated
 │         ↓
 │  Welcome email sent
 │
 └─→ User status: VERIFIED, CAN LOGIN

STEP 3: User Logs In
 │
 │  POST /api/auth/login
 │  {email, password}
 │         ↓
 │    Password verified
 │         ↓
 │  JWT Token generated
 │
 └─→ Response: JWT Token (required for all profile endpoints)

STEP 4: User Builds Profile (with JWT token)
 │
 ├─ PUT /api/users/profile → Saves profile data
 ├─ POST /api/users/avatar → Uploads photo
 ├─ POST /api/users/skills (×N) → Adds skills
 └─ POST /api/users/documents (×N) → Uploads documents
          ↓
 All requests require: "Authorization: Bearer {JWT}"

STEP 5: Profile Visible to Others
 │
 │  GET /api/users/profile/john@example.com
 │         ↓
 │  Returns complete public profile
 │  (if not private)

```

---

## 🧩 File Upload with Multer

```
User selects file
     │
     ↓
POST /api/users/avatar or /documents
     │
     ├─ Multer middleware
     │  │
     │  ├─ Check file type
     │  │  ├─ Avatar: JPG/PNG/GIF/WebP only
     │  │  └─ Documents: PDF/Word/Excel/PowerPoint
     │  │
     │  └─ Check file size
     │     └─ Max 10MB
     │
     ├─ File goes to memory buffer
     │  └─ (no server disk touched)
     │
     ├─ req.file object available
     │  ├─ req.file.buffer (file bytes)
     │  ├─ req.file.mimetype (file/pdf)
     │  ├─ req.file.originalname (filename)
     │  └─ req.file.size (bytes)
     │
     └─ Upload to Firebase Storage
        │
        ├─ Create path: "avatars/" or "documents/"
        ├─ Generate unique filename (+ timestamp)
        ├─ Upload binary data
        │
        ├─ Get signed URL
        │  └─ Valid for specific period
        │
        └─ Save URL in Firestore user document
           │
           └─ Return to user
```

---

## ✅ Implementation Checklist

```
Server Setup
├─ ✅ Multer installed
├─ ✅ multer.js config created
├─ ✅ File validation working
└─ ✅ Firebase Storage connected

Model Updates
├─ ✅ skills array added to User model
├─ ✅ documents array added to User model
├─ ✅ Firestore save/update methods working
└─ ✅ getPublicProfile() includes new fields

Controller Methods
├─ ✅ addSkill()
├─ ✅ updateSkill()
├─ ✅ removeSkill()
├─ ✅ getSkills()
├─ ✅ uploadDocument()
├─ ✅ removeDocument()
├─ ✅ getDocuments()
└─ ✅ updateDocumentInfo()

Routes & Middleware
├─ ✅ Multer middleware added to avatar route
├─ ✅ 9 new routes created
├─ ✅ All routes have authentication
├─ ✅ All routes have role-based access
├─ ✅ Swagger documentation for all
└─ ✅ Error handling in place

Testing
├─ ✅ Server starts cleanly
├─ ✅ No module duplication
├─ ✅ Swagger UI shows all endpoints
├─ ✅ Ready for user testing
└─ ✅ Documentation complete
```

---

## 🎯 Next Actions

1. **Test in Swagger UI:** http://localhost:5000/api/docs
2. **Read detailed guide:** `PROFILE_MANAGEMENT_GUIDE.md`
3. **Follow test workflow** in IMPLEMENTATION_SUMMARY.md
4. **Report any issues** with specific endpoints

---

## 💬 Quick Reference

| Feature | What it does | How to use |
|---------|-------------|-----------|
| **Avatar** | Profile photo | POST /avatar + image file |
| **Skills** | Track expertise | POST /skills (repeatable) |
| **Documents** | Upload CV/certs | POST /documents + PDF/Word |
| **Profile** | Bio & basics | PUT /profile + data |
| **All at once** | View everything | GET /profile/email |

