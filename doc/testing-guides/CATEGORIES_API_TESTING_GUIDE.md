# Categories Module - API Testing Guide

## Overview
The Categories Module allows users to manage project categories and subcategories. It includes 15 pre-built main categories with multiple subcategories, plus the ability to add custom ones.

## Getting Started

### 1. Start the Development Server
```bash
npm run dev
```

You should see:
```
✅ Firestore initialized successfully
Server running on port 5000
```

### 2. Access Swagger Documentation
Open your browser and navigate to:
```
http://localhost:5000/api/docs
```

Look for the **Categories** section (blue tag) in the left panel.

---

## API Endpoints Overview

### 1. **GET /api/categories**
**Purpose**: Retrieve all available categories (auto-seeds database if empty)

**What it does**:
- Returns all 15 main categories with their subcategories
- Automatically populates the database on first call if empty
- Adds an "Other (Custom)" option at the end for users to create custom categories

**Query Parameters**:
- `type` (optional): Filter by category type (e.g., `project_type`)

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123def456",
      "name": "Agriculture & Agribusiness",
      "description": "Farming, livestock, and related businesses",
      "type": "project_type",
      "subCategories": [
        "Crop Farming",
        "Livestock Management",
        "Irrigation Systems",
        ...
      ],
      "status": "active",
      "createdAt": "2024-04-20T10:30:00.000Z",
      "updatedAt": "2024-04-20T10:30:00.000Z"
    },
    {
      "id": "other_custom",
      "name": "Other (Custom)",
      "description": "Add a custom category",
      "type": "other",
      "subCategories": []
    }
  ]
}
```

### 2. **GET /api/categories/{id}**
**Purpose**: Retrieve a specific category by ID

**Test in Swagger**:
1. Get the ID from the first endpoint response
2. Paste it in the `id` parameter field
3. Click "Try it out"

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "name": "Agriculture & Agribusiness",
    ...
  }
}
```

---

## Testing Steps in Swagger UI

### Step 1: Get All Categories (First Time)
1. Scroll to **GET /api/categories**
2. Click **"Try it out"**
3. Leave parameters blank
4. Click **"Execute"**

**Result**: You should see all 15 categories + the "Other" option. This triggers the auto-seed on first call.

### Step 2: Create a Custom Category
1. Scroll to **POST /api/categories**
2. Click **"Try it out"**
3. In the request body, replace with:
```json
{
  "name": "My Custom Category",
  "description": "A custom category for my project",
  "type": "other",
  "subCategories": ["Custom Sub 1", "Custom Sub 2"]
}
```
4. Click **"Execute"**

**Expected**: Status 201 Created with your new category ID

### Step 3: Add a Subcategory
1. Copy the category ID from the response above
2. Scroll to **POST /api/categories/{id}/subcategories**
3. Click **"Try it out"**
4. Paste the ID in the `id` field
5. In request body, use:
```json
{
  "subCategory": "New Subcategory"
}
```
6. Click **"Execute"**

**Expected**: Status 200 OK showing the updated category with new subcategory

### Step 4: Update a Category
1. Scroll to **PUT /api/categories/{id}**
2. Click **"Try it out"**
3. Paste a category ID in the `id` field
4. Update request body:
```json
{
  "description": "Updated description",
  "name": "Updated Name"
}
```
5. Click **"Execute"**

### Step 5: Remove a Subcategory
1. Scroll to **DELETE /api/categories/{id}/subcategories/{subCategory}**
2. Click **"Try it out"**
3. Fill in:
   - `id`: The category ID
   - `subCategory`: Name of subcategory to remove
4. Click **"Execute"**

### Step 6: Delete a Category
1. Scroll to **DELETE /api/categories/{id}**
2. Click **"Try it out"**
3. Paste a category ID
4. Click **"Execute"**

**Note**: This performs a soft delete (marks as deleted, doesn't remove from DB)

---

## Pre-built Categories List

When you call `GET /api/categories` for the first time, you'll get:

1. 🌱 **Agriculture & Agribusiness** (10 subcategories)
2. 💻 **Technology & Software** (10 subcategories)
3. 🏥 **Health & Medical** (9 subcategories)
4. 🎓 **Education (EdTech)** (8 subcategories)
5. 💰 **Business & Finance** (9 subcategories)
6. 🏗️ **Engineering & Construction** (7 subcategories)
7. 🚗 **Transport & Logistics** (7 subcategories)
8. 🌍 **Environment & Energy** (7 subcategories)
9. 🎮 **Entertainment & Media** (7 subcategories)
10. 🏠 **Real Estate & Housing** (5 subcategories)
11. 🛍️ **Commerce & Marketplace** (5 subcategories)
12. ⚖️ **Governance & Public Services** (5 subcategories)
13. 🔐 **Security & Safety** (5 subcategories)
14. 🧠 **Research & Innovation** (5 subcategories)
15. 👥 **Social Impact & Community** (5 subcategories)

---

## Error Handling Tests

### Test 1: Get non-existent category
1. Go to **GET /api/categories/{id}**
2. Enter an invalid ID (e.g., "invalid123")
3. Expected: 404 Not Found
```json
{
  "success": false,
  "message": "Category not found"
}
```

### Test 2: Create category with missing required fields
1. Go to **POST /api/categories**
2. Send empty body or missing `name` or `type`
3. Expected: 400 Bad Request with validation errors

### Test 3: Add duplicate subcategory
1. Try adding a subcategory that already exists
2. Expected: 400 Bad Request
```json
{
  "success": false,
  "message": "This subcategory already exists"
}
```

---

## Frontend Integration Example

When building your UI, use this pattern:

```javascript
// 1. Fetch categories
const response = await fetch('http://localhost:5000/api/categories');
const { data: categories } = await response.json();

// 2. Display dropdown with categories
categories.forEach(cat => {
  if (cat.id === 'other_custom') {
    // Show "Other" button that opens custom input
  } else {
    // Show category as dropdown option
  }
});

// 3. If user selects "Other", allow custom input
const customCategoryName = prompt('Enter custom category name');
const response = await fetch('http://localhost:5000/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: customCategoryName,
    type: 'other',
    description: ''
  })
});
```

---

## Database Verification

To verify categories are saved in Firestore:
1. Go to Firebase Console
2. Select your project
3. Navigate to **Firestore Database**
4. Look for the `categories` collection
5. You should see 15 documents after first GET call

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Categories not appearing | Call `GET /api/categories` once to trigger auto-seed |
| "Category not found" on valid ID | The ID might be deleted. Check Firebase console |
| CORS error | Ensure `.env` has correct `CLIENT_URL` |
| Duplicate subcategory error | Use different subcategory name |
| Port already in use | Change port in `.env` or kill process on port 5000 |

---

## Quick Checklist

- [ ] Server running (`npm run dev`)
- [ ] Swagger accessible at `http://localhost:5000/api/docs`
- [ ] `GET /api/categories` returns 16 items (15 + "Other")
- [ ] Can create custom category with POST
- [ ] Can add subcategory to existing category
- [ ] Can retrieve by ID
- [ ] Can update category
- [ ] Can delete (soft delete) category
- [ ] Firebase Firestore has `categories` collection

---

## Need Help?

Check these files for reference:
- Models: `src/modules/categories/models/category.model.js`
- Services: `src/modules/categories/services/category.service.js`
- Controllers: `src/modules/categories/controllers/category.controller.js`
- Routes: `src/modules/categories/routes/category.routes.js`
- Seed Data: `src/modules/categories/utils/seedData.js`
