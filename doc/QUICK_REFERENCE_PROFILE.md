# Quick Reference - Profile Management APIs

## 🎨 Avatar Upload (FIXED ✅)
```
POST /api/users/avatar
Form-Data: avatar (file)
Response: { avatar: "https://..." }
```

## 👤 Profile Update
```
PUT /api/users/profile
{
  "firstName", "lastName", "phone",
  "bio", "company", "location", 
  "website", "specialization", "yearsOfExperience"
}
```

## 🎓 Skills Management
```
GET    /api/users/skills              → List all
POST   /api/users/skills              → Add new
PUT    /api/users/skills/:skillId     → Update
DELETE /api/users/skills/:skillId     → Remove
```

## 📄 Documents Management
```
GET    /api/users/documents              → List all
POST   /api/users/documents              → Upload (form-data: file)
PUT    /api/users/documents/:documentId  → Update info
DELETE /api/users/documents/:documentId  → Remove
```

## 💾 File Upload Details
- **Avatar:** JPG, PNG, GIF, WebP (max 10MB)
- **Documents:** PDF, Word, Excel, PowerPoint (max 10MB)
- **Storage:** Firebase Storage with signed URLs
- **Multer:** Configured with memory storage

## 📊 Data Structure

**Skills**
```json
{
  "id": "skill-timestamp",
  "name": "JavaScript",
  "level": "Beginner|Intermediate|Advanced|Expert",
  "yearsOf": 5,
  "category": "Programming"
}
```

**Documents**
```json
{
  "id": "doc-timestamp",
  "name": "Resume",
  "type": "resume|certificate|portfolio",
  "url": "https://...",
  "fileSize": 245000,
  "uploadedAt": "2024-03-01T10:00:00Z"
}
```

## ✅ Files Changed
1. ✅ `src/config/multer.js` (NEW)
2. ✅ `src/models/user.model.js` (skills + documents fields)
3. ✅ `src/controllers/user.controller.js` (+7 new methods)
4. ✅ `src/routes/user.routes.js` (multer added to avatar, +9 routes)
5. ✅ `package.json` (multer installed)
