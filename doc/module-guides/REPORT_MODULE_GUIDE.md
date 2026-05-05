# Report Module Guide

## Overview
The Report Module is an admin-only feature designed for generating, managing, and distributing comprehensive platform reports and statistics. It provides insights into user activities, project metrics, marketplace performance, and system analytics.

**Access Level:** Admin only  
**Authentication:** JWT Bearer Token required  
**Base URL:** `/api/reports` and `/api/statistics`

---

## Features

### 1. **Statistics Generation**
Generate comprehensive platform statistics including:
- User metrics (total users, active users, users by role)
- Project metrics (projects by status, funding information)
- Activity metrics (user interactions, engagement)
- Marketplace metrics (companies, products, services)

### 2. **Report Management**
Create, retrieve, update, and delete different types of reports:
- **Activity Reports** - Track recent platform activities
- **Analytics Reports** - Detailed performance analytics
- **Custom Reports** - User-defined reports

### 3. **Report Distribution**
Schedule reports for recurring distribution to multiple recipients via email:
- Daily, weekly, or monthly frequency
- Multiple recipient support
- Scheduled and manual distribution

### 4. **Report Export**
Export reports in multiple formats:
- JSON (raw data)
- CSV (spreadsheet)
- PDF (formatted document)

---

## Statistics Endpoints

### Get Latest Statistics
**Endpoint:** `GET /api/statistics/latest`  
**Authentication:** Required (Admin only)  
**Description:** Retrieve the most recent platform statistics

```bash
curl -X GET http://localhost:5000/api/statistics/latest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userStatistics": {
      "totalUsers": 150,
      "activeUsers": 120,
      "usersByRole": {
        "student": 60,
        "entrepreneur": 30,
        "company": 20,
        "investor": 25,
        "mentor": 10,
        "admin": 5
      },
      "newUsersThisMonth": 25,
      "verifiedUsers": 145,
      "unverifiedUsers": 5
    },
    "projectStatistics": {
      "totalProjects": 45,
      "projectsByStatus": {
        "soumis": 10,
        "en_evaluation": 8,
        "en_revision": 5,
        "bancable": 15,
        "rejete": 5,
        "archivé": 2
      },
      "totalFundingRequested": 5000000,
      "averageFundingPerProject": 111111.11
    },
    "marketplaceStatistics": {
      "totalCompanies": 30,
      "totalProducts": 85,
      "totalServices": 45,
      "totalNews": 120
    },
    "generatedAt": "2024-04-28T10:30:00Z",
    "period": "daily"
  }
}
```

### Get Statistics by Period
**Endpoint:** `GET /api/statistics/period?period=monthly`  
**Query Parameters:**
- `period` - daily, weekly, monthly, yearly

**Example:**
```bash
curl -X GET "http://localhost:5000/api/statistics/period?period=weekly" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Statistics Trends
**Endpoint:** `GET /api/statistics/trends?startDate=2024-04-01&endDate=2024-04-28`  
**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Example:**
```bash
curl -X GET "http://localhost:5000/api/statistics/trends?startDate=2024-04-01&endDate=2024-04-28" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate Statistics
**Endpoint:** `POST /api/statistics/generate`  
**Description:** Manually trigger statistics generation

```bash
curl -X POST http://localhost:5000/api/statistics/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Specific Statistics
**Endpoints:**
- `GET /api/statistics/users` - User statistics only
- `GET /api/statistics/projects` - Project statistics only
- `GET /api/statistics/marketplace` - Marketplace statistics only

---

## Report Endpoints

### Create Activity Report
**Endpoint:** `POST /api/reports`  
**Description:** Create a new activity report

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "title": "Weekly Activity Report",
    "description": "Summary of platform activities",
    "scope": "platform",
    "periodStart": "2024-04-21T00:00:00Z",
    "periodEnd": "2024-04-28T23:59:59Z"
  }
```

**Request Fields:**
- `title` (string) - Report title (3-100 characters)
- `description` (string) - Report description (max 500 characters)
- `scope` (string) - platform, users, projects, or marketplace
- `periodStart` (ISO datetime) - Report start date
- `periodEnd` (ISO datetime) - Report end date

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report_12345",
    "title": "Weekly Activity Report",
    "description": "Summary of platform activities",
    "reportType": "activity",
    "scope": "platform",
    "status": "generated",
    "format": "json",
    "generatedBy": "admin@example.com",
    "generatedAt": "2024-04-28T10:30:00Z",
    "isScheduled": false
  }
}
```

### Create Analytics Report
**Endpoint:** `POST /api/reports/analytics`  
**Similar to activity report but with focus on analytics data**

```bash
curl -X POST http://localhost:5000/api/reports/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "title": "Performance Analytics",
    "description": "Platform performance metrics",
    "scope": "platform"
  }
```

### Get All Reports
**Endpoint:** `GET /api/reports`  
**Query Parameters (Optional):**
- `status` - generated, scheduled, archived
- `reportType` - activity, analytics, custom
- `scope` - platform, users, projects, marketplace

```bash
# Get all reports
curl -X GET http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get only archived reports
curl -X GET "http://localhost:5000/api/reports?status=archived" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get reports by type
curl -X GET "http://localhost:5000/api/reports?reportType=analytics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Report by ID
**Endpoint:** `GET /api/reports/{id}`

```bash
curl -X GET http://localhost:5000/api/reports/report_12345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Reports by Type
**Endpoint:** `GET /api/reports/type/{type}`  
**Types:** activity, analytics, custom

```bash
curl -X GET http://localhost:5000/api/reports/type/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Report
**Endpoint:** `PUT /api/reports/{id}`

```bash
curl -X PUT http://localhost:5000/api/reports/report_12345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "title": "Updated Report Title",
    "status": "archived"
  }
```

### Delete Report
**Endpoint:** `DELETE /api/reports/{id}`

```bash
curl -X DELETE http://localhost:5000/api/reports/report_12345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Schedule Report Distribution
**Endpoint:** `POST /api/reports/{id}/schedule`  
**Description:** Set up recurring report distribution

```bash
curl -X POST http://localhost:5000/api/reports/report_12345/schedule \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "recipients": ["admin@example.com", "manager@example.com"],
    "frequency": "weekly"
  }
```

**Request Fields:**
- `recipients` (array of strings) - Email addresses
- `frequency` (string) - daily, weekly, monthly

### Unschedule Report
**Endpoint:** `POST /api/reports/{id}/unschedule`  
**Description:** Stop recurring report distribution

```bash
curl -X POST http://localhost:5000/api/reports/report_12345/unschedule \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Export Report
**Endpoint:** `GET /api/reports/{id}/export?format=json`  
**Query Parameters:**
- `format` - json (default), csv, pdf

```bash
# Export as JSON
curl -X GET "http://localhost:5000/api/reports/report_12345/export?format=json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Export as CSV
curl -X GET "http://localhost:5000/api/reports/report_12345/export?format=csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Export as PDF
curl -X GET "http://localhost:5000/api/reports/report_12345/export?format=pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Archive Old Reports
**Endpoint:** `POST /api/reports/archive`  
**Description:** Move reports older than specified days to archived status

```bash
curl -X POST http://localhost:5000/api/reports/archive \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "days": 180
  }
```

**Request Fields:**
- `days` (integer) - Archive reports older than this many days (default: 180)

---

## Data Models

### Statistics Object
```javascript
{
  userStatistics: {
    totalUsers: number,
    activeUsers: number,
    usersByRole: {
      student: number,
      entrepreneur: number,
      company: number,
      investor: number,
      mentor: number,
      admin: number
    },
    newUsersThisMonth: number,
    verifiedUsers: number,
    unverifiedUsers: number
  },
  projectStatistics: {
    totalProjects: number,
    projectsByStatus: {
      soumis: number,
      en_evaluation: number,
      en_revision: number,
      bancable: number,
      rejete: number,
      archivé: number
    },
    projectsByFunding: {
      subvention: number,
      investissement: number,
      mixte: number
    },
    totalFundingRequested: number,
    averageFundingPerProject: number
  },
  marketplaceStatistics: {
    totalCompanies: number,
    totalProducts: number,
    totalServices: number,
    totalNews: number
  },
  generatedAt: ISO_datetime,
  period: "daily|weekly|monthly|yearly"
}
```

### Report Object
```javascript
{
  id: string,
  title: string (3-100 chars),
  description: string (max 500 chars),
  reportType: "activity|analytics|custom",
  scope: "platform|users|projects|marketplace",
  periodStart: ISO_datetime,
  periodEnd: ISO_datetime,
  status: "generated|scheduled|archived",
  format: "json|csv|pdf",
  generatedBy: email,
  generatedAt: ISO_datetime,
  isScheduled: boolean,
  recipients: string[] (emails),
  frequency: "daily|weekly|monthly"
}
```

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

**403 Forbidden (Not Admin)**
```json
{
  "success": false,
  "message": "Access denied - Admin role required"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 100 characters"
    }
  ]
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Report not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Failed to generate report",
  "error": "Error details"
}
```

---

## Usage Examples

### Example 1: Generate Weekly Report and Schedule Distribution
```javascript
// 1. Create activity report
const reportResponse = await fetch('/api/reports', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Weekly Activity Report',
    description: 'Platform activity for week of April 21-28',
    scope: 'platform',
    periodStart: '2024-04-21T00:00:00Z',
    periodEnd: '2024-04-28T23:59:59Z'
  })
});

const report = await reportResponse.json();
const reportId = report.data.id;

// 2. Schedule distribution
await fetch(`/api/reports/${reportId}/schedule`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipients: ['admin@example.com', 'manager@example.com'],
    frequency: 'weekly'
  })
});

// 3. Export as CSV
const exportResponse = await fetch(
  `/api/reports/${reportId}/export?format=csv`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

### Example 2: Get Statistics and Create Report
```javascript
// 1. Get latest statistics
const statsResponse = await fetch('/api/statistics/latest', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await statsResponse.json();

console.log(`Total Users: ${stats.data.userStatistics.totalUsers}`);
console.log(`Total Projects: ${stats.data.projectStatistics.totalProjects}`);

// 2. Create analytics report based on stats
await fetch('/api/reports/analytics', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: `Analytics Report - ${new Date().toLocaleDateString()}`,
    description: 'Comprehensive platform analytics',
    scope: 'platform'
  })
});
```

---

## Testing with Swagger UI

1. Navigate to `http://localhost:5000/api/docs`
2. Look for **Statistics** and **Reports** sections
3. Click on any endpoint to expand it
4. Click **"Try it out"** button
5. Enter your JWT token in the Authorization header
6. Fill in required parameters
7. Click **"Execute"** to test the endpoint

---

## Database Collections

The Report Module uses two main Firestore collections:

### `statistics` Collection
- Stores historical statistics data
- Auto-deletes records older than 90 days
- Used for trend analysis

### `reports` Collection
- Stores all generated reports
- Maintains report metadata and scheduling info
- Auto-archives reports older than 180 days

---

## Rate Limiting

Report endpoints have rate limiting applied to prevent abuse:
- Standard rate limit: 100 requests per 15 minutes for authenticated users
- Admin endpoints may have different limits

---

## Best Practices

1. **Schedule Reports** for regular distribution instead of manual retrieval
2. **Archive Old Reports** to maintain database performance
3. **Export Reports** in appropriate format for sharing
4. **Monitor Statistics** regularly to track platform health
5. **Use Trends** endpoint for historical analysis and forecasting

---

## Troubleshooting

### "Admin role required" error
- Verify your account has admin role
- Check your JWT token is valid
- Ensure Bearer token is properly formatted

### "Report not found" error
- Verify the report ID is correct
- Check if report has been archived
- Ensure you have access to the report

### Export fails
- CSV/PDF export may not be fully implemented in current version
- JSON export is always available
- Try exporting as JSON first

---

## Support & Documentation

For more details on specific endpoints, visit the Swagger UI documentation at `/api/docs`
