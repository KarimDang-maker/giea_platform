# Dashboard Module Guide

## Overview
The Dashboard Module provides a personalized dashboard for all authenticated users. Each user gets a customized view of their recent activities, personalized recommendations, quick access links, and key statistics based on their role.

**Access Level:** All authenticated users  
**Authentication:** JWT Bearer Token required  
**Base URL:** `/api/dashboard`, `/api/dashboard/activities`, `/api/dashboard/recommendations`

---

## Features

### 1. **Personalized Dashboard**
Each user receives a customized dashboard containing:
- Recent activities and notifications
- Personalized recommendations based on role
- Quick access links to main features
- User statistics (projects, resources, profile completion %)

### 2. **Activity Tracking**
Track all user activities on the platform:
- Project creation and updates
- Comments and messages
- Resource uploads
- Profile changes
- Connections made

### 3. **Smart Recommendations**
Get personalized suggestions based on:
- User role (student, entrepreneur, investor, company, mentor)
- Activity history
- Interests and skills
- Network connections

### 4. **Quick Access Links**
Role-specific shortcuts to frequently used features:
- Projects, Resources, Skills (for students)
- Investor connections, Marketplace (for entrepreneurs)
- Talent search, Job management (for companies)
- Investment opportunities (for investors)

---

## Dashboard Endpoints

### Get User Dashboard
**Endpoint:** `GET /api/dashboard`  
**Authentication:** Required  
**Description:** Get the complete personalized dashboard with all data

```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "userName": "user@example.com",
    "userRole": "student",
    "recentActivities": [
      {
        "id": "activity1",
        "type": "project_created",
        "title": "New Project Created",
        "description": "You created a new project",
        "entityType": "project",
        "entityId": "proj_456",
        "timestamp": "2024-04-28T10:30:00Z",
        "isRead": false
      }
    ],
    "recommendations": [
      {
        "id": "rec1",
        "type": "project",
        "title": "Explore Collaborative Projects",
        "description": "Join projects matching your skills",
        "reason": "Based on your profile",
        "relevanceScore": 85,
        "isDismissed": false
      }
    ],
    "quickLinks": [
      {
        "title": "Dashboard",
        "description": "View your dashboard",
        "path": "/dashboard",
        "icon": "dashboard"
      },
      {
        "title": "Projects",
        "description": "Browse projects",
        "path": "/projects",
        "icon": "folder"
      }
    ],
    "statistics": {
      "totalProjects": 5,
      "totalResources": 12,
      "profileCompletion": 75,
      "role": "student",
      "joinedDate": "2024-01-15T10:30:00Z"
    },
    "notifications": [],
    "createdAt": "2024-04-28T08:00:00Z",
    "updatedAt": "2024-04-28T10:30:00Z"
  },
  "message": "Dashboard retrieved successfully"
}
```

### Refresh Dashboard
**Endpoint:** `POST /api/dashboard/refresh`  
**Description:** Refresh all dashboard data to get latest information

```bash
curl -X POST http://localhost:5000/api/dashboard/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/statistics`  
**Description:** Get user-specific statistics

```bash
curl -X GET http://localhost:5000/api/dashboard/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "totalResources": 12,
    "profileCompletion": 75,
    "role": "student",
    "joinedDate": "2024-01-15T10:30:00Z"
  },
  "message": "Statistics retrieved successfully"
}
```

---

## Activity Endpoints

### Get Recent Activities
**Endpoint:** `GET /api/dashboard/activities`  
**Query Parameters:**
- `limit` (optional, default: 10, max: 100) - Number of activities to retrieve

```bash
# Get 10 recent activities
curl -X GET http://localhost:5000/api/dashboard/activities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get 25 recent activities
curl -X GET "http://localhost:5000/api/dashboard/activities?limit=25" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity1",
      "userId": "user123",
      "type": "project_created",
      "title": "New Project Created",
      "description": "You created project 'AI Innovation'",
      "entityType": "project",
      "entityId": "proj_456",
      "actionBy": "user123",
      "actionByName": "John Doe",
      "timestamp": "2024-04-28T10:30:00Z",
      "isRead": false
    },
    {
      "id": "activity2",
      "userId": "user123",
      "type": "comment_added",
      "title": "Comment Added",
      "description": "You commented on a project",
      "entityType": "comment",
      "entityId": "comment_789",
      "timestamp": "2024-04-27T15:20:00Z",
      "isRead": true
    }
  ],
  "message": "Activities retrieved successfully"
}
```

### Get Activities by Type
**Endpoint:** `GET /api/dashboard/activities/type/{type}`  
**Path Parameters:**
- `type` - Activity type (project_created, project_updated, comment_added, resource_uploaded, message_received, etc.)

```bash
curl -X GET "http://localhost:5000/api/dashboard/activities/type/project_created" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:5000/api/dashboard/activities/type/comment_added?limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Unread Activities Count
**Endpoint:** `GET /api/dashboard/activities/unread/count`  
**Description:** Get total count of unread activities

```bash
curl -X GET http://localhost:5000/api/dashboard/activities/unread/count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  },
  "message": "Unread count retrieved successfully"
}
```

### Mark Activity as Read
**Endpoint:** `POST /api/dashboard/activities/{id}/read`  
**Description:** Mark a specific activity as read

```bash
curl -X POST http://localhost:5000/api/dashboard/activities/activity1/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Mark All Activities as Read
**Endpoint:** `POST /api/dashboard/activities/read-all`  
**Description:** Mark all unread activities as read

```bash
curl -X POST http://localhost:5000/api/dashboard/activities/read-all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Clean Up Old Activities
**Endpoint:** `POST /api/dashboard/activities/cleanup`  
**Description:** Delete activities older than specified days (default 90)

```bash
# Delete activities older than 90 days
curl -X POST http://localhost:5000/api/dashboard/activities/cleanup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "days": 90
  }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 25
  },
  "message": "25 old activities deleted"
}
```

---

## Recommendation Endpoints

### Get Active Recommendations
**Endpoint:** `GET /api/dashboard/recommendations`  
**Query Parameters:**
- `limit` (optional, default: 5, max: 50) - Number of recommendations

```bash
curl -X GET http://localhost:5000/api/dashboard/recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get 10 recommendations
curl -X GET "http://localhost:5000/api/dashboard/recommendations?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec1",
      "userId": "user123",
      "type": "project",
      "title": "Explore Collaborative Projects",
      "description": "Join projects matching your skills and interests",
      "reason": "Based on your profile and recent activities",
      "targetType": "projects",
      "relevanceScore": 85,
      "isDismissed": false,
      "createdAt": "2024-04-28T10:00:00Z",
      "expiresAt": "2024-05-28T10:00:00Z"
    },
    {
      "id": "rec2",
      "type": "resource",
      "title": "Learning Resources",
      "description": "Check out recommended courses and tutorials",
      "reason": "Recommended for skill development",
      "relevanceScore": 75,
      "isDismissed": false
    }
  ],
  "message": "Recommendations retrieved successfully"
}
```

### Get Recommendations by Type
**Endpoint:** `GET /api/dashboard/recommendations/type/{type}`  
**Types:** project, resource, connection, skill, category, community, talent, etc.

```bash
curl -X GET "http://localhost:5000/api/dashboard/recommendations/type/project" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:5000/api/dashboard/recommendations/type/resource?limit=15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate New Recommendations
**Endpoint:** `POST /api/dashboard/recommendations/generate`  
**Description:** Generate fresh recommendations based on user role

```bash
curl -X POST http://localhost:5000/api/dashboard/recommendations/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Role-Based Recommendations:**
- **Student:** Project opportunities, Learning resources, Skills development
- **Entrepreneur:** Investor connections, Business tools, Marketplace features
- **Company:** Talent search, Job management, Marketplace
- **Investor:** Investment opportunities, Portfolio management
- **Mentor:** Mentee connections, Resources
- **Admin:** System reports, User management, Statistics
- **All Users:** Community events, Networking opportunities

### Dismiss Recommendation
**Endpoint:** `POST /api/dashboard/recommendations/{id}/dismiss`  
**Description:** Dismiss (reject) a recommendation so it no longer appears

```bash
curl -X POST http://localhost:5000/api/dashboard/recommendations/rec1/dismiss \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Clean Up Expired Recommendations
**Endpoint:** `POST /api/dashboard/recommendations/cleanup`  
**Description:** Delete expired recommendations

```bash
curl -X POST http://localhost:5000/api/dashboard/recommendations/cleanup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "message": "3 expired recommendations deleted"
}
```

---

## Data Models

### Dashboard Object
```javascript
{
  userId: string,
  userName: string,
  userRole: "student|entrepreneur|company|investor|mentor|admin",
  recentActivities: Activity[],
  recommendations: Recommendation[],
  quickLinks: QuickLink[],
  statistics: {
    totalProjects: number,
    totalResources: number,
    profileCompletion: number (0-100),
    role: string,
    joinedDate: ISO_datetime
  },
  notifications: object[],
  createdAt: ISO_datetime,
  updatedAt: ISO_datetime
}
```

### Activity Object
```javascript
{
  id: string,
  userId: string,
  type: string (project_created, project_updated, comment_added, etc.),
  title: string,
  description: string,
  entityType: "project|resource|comment|message|profile",
  entityId: string,
  actionBy: string,
  actionByName: string,
  relatedData: object,
  timestamp: ISO_datetime,
  isRead: boolean,
  metadata: object
}
```

### Recommendation Object
```javascript
{
  id: string,
  userId: string,
  type: string (project, resource, connection, skill, etc.),
  title: string,
  description: string,
  reason: string,
  targetId: string,
  targetType: string,
  relevanceScore: number (0-100),
  metadata: object,
  isDismissed: boolean,
  createdAt: ISO_datetime,
  expiresAt: ISO_datetime (optional)
}
```

### QuickLink Object
```javascript
{
  title: string,
  description: string,
  path: string,
  icon: string
}
```

---

## Role-Based Quick Links

### Student
- Dashboard - View your dashboard
- Profile - Edit your profile
- Projects - Browse projects
- Resources - Learning resources
- Skills - Manage skills

### Entrepreneur
- Dashboard - View your dashboard
- Profile - Edit your profile
- My Projects - Manage projects
- Investors - Find investors
- Marketplace - Services & products

### Company
- Dashboard - View your dashboard
- Profile - Edit your profile
- Talent Search - Find professionals
- Jobs - Manage job posts
- Marketplace - Products & services

### Investor
- Dashboard - View your dashboard
- Profile - Edit your profile
- Projects - Investment opportunities
- Portfolio - Manage investments

### Mentor
- Dashboard - View your dashboard
- Profile - Edit your profile
- Mentees - Manage mentees
- Resources - Mentoring resources

### Admin
- Dashboard - View your dashboard
- Profile - Edit your profile
- Reports - View reports
- Statistics - View statistics
- Users - Manage users

---

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or expired token"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "limit",
      "message": "Limit must be between 1 and 100"
    }
  ]
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Failed to fetch dashboard",
  "error": "Error details"
}
```

---

## Usage Examples

### Example 1: View Dashboard and Check Unread Activities
```javascript
// 1. Get dashboard
const dashboardResponse = await fetch('/api/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const dashboard = await dashboardResponse.json();

console.log(`Welcome, ${dashboard.data.userName}`);
console.log(`Profile Completion: ${dashboard.data.statistics.profileCompletion}%`);
console.log(`Total Projects: ${dashboard.data.statistics.totalProjects}`);

// 2. Check unread count
const unreadResponse = await fetch('/api/dashboard/activities/unread/count', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const unread = await unreadResponse.json();
console.log(`Unread Activities: ${unread.data.unreadCount}`);

// 3. Mark all as read
await fetch('/api/dashboard/activities/read-all', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Example 2: Get Personalized Recommendations
```javascript
// 1. Get active recommendations (default 5)
const recResponse = await fetch('/api/dashboard/recommendations', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const recommendations = await recResponse.json();

recommendations.data.forEach(rec => {
  console.log(`${rec.title} - Score: ${rec.relevanceScore}`);
});

// 2. Get project recommendations specifically
const projectRecsResponse = await fetch(
  '/api/dashboard/recommendations/type/project?limit=10',
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const projectRecs = await projectRecsResponse.json();

// 3. Dismiss a recommendation
await fetch(`/api/dashboard/recommendations/${recId}/dismiss`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Example 3: Track Recent Activities
```javascript
// 1. Get recent activities
const activitiesResponse = await fetch('/api/dashboard/activities?limit=20', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const activities = await activitiesResponse.json();

// 2. Display activity feed
activities.data.forEach(activity => {
  console.log(`[${activity.timestamp}] ${activity.title}`);
  console.log(`  ${activity.description}`);
});

// 3. Mark unread activity as read
if (activities.data.some(a => !a.isRead)) {
  const unreadActivity = activities.data.find(a => !a.isRead);
  await fetch(`/api/dashboard/activities/${unreadActivity.id}/read`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### Example 4: Generate Fresh Recommendations Periodically
```javascript
// Generate new recommendations based on user role
const generateResponse = await fetch(
  '/api/dashboard/recommendations/generate',
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const newRecs = await generateResponse.json();

console.log(`Generated ${newRecs.data.length} new recommendations`);

// Clean up old expired ones
await fetch('/api/dashboard/recommendations/cleanup', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Testing with Swagger UI

1. Navigate to `http://localhost:5000/api/docs`
2. Look for **Dashboard**, **Activities**, and **Recommendations** sections
3. Click on any endpoint to expand
4. Click **"Try it out"** button
5. Enter your JWT token in Authorization
6. Fill in any required parameters
7. Click **"Execute"** to test

---

## Database Collections

The Dashboard Module uses three main Firestore collections:

### `activities` Collection
- Stores user activity records
- Indexed by userId and timestamp
- Auto-deletes records older than 90 days

### `recommendations` Collection
- Stores personalized recommendations
- Indexed by userId and relevanceScore
- Auto-deletes expired recommendations

### `dashboards` Collection
- Stores dashboard state per user
- Caches statistics and quick links
- Updated on refresh

---

## Performance Tips

1. **Limit Query Size:** Use `limit` parameter to reduce data transfer
2. **Batch Operations:** Mark all as read instead of individual items
3. **Clean Up Regularly:** Delete old activities and recommendations
4. **Refresh Strategically:** Only refresh when needed, not on every page load
5. **Cache Results:** Store dashboard data in client-side cache

---

## Best Practices

1. **Display Unread Count:** Show badge with unread activity count
2. **Auto-Refresh Periodically:** Refresh dashboard every 5-10 minutes
3. **Show Recommendations:** Display top 3-5 recommendations on dashboard
4. **Archive Activities:** Automatically clean old activities monthly
5. **Personalize UI:** Use role from dashboard to show relevant features

---

## Troubleshooting

### "Activities not appearing" error
- Check if activities have been created (new users may have no activities)
- Verify the `limit` parameter is appropriate
- Try increasing the limit value

### "Recommendations not showing" error
- Generate recommendations first with POST /recommendations/generate
- Check if user role is set correctly
- Verify recommendations haven't expired

### "Profile completion showing 0%" error
- Update user profile with more information
- Refresh dashboard after profile updates
- Check user fields: firstName, lastName, email, phone, bio, profilePicture

---

## Support & Documentation

For more details on specific endpoints, visit the Swagger UI documentation at `/api/docs`
