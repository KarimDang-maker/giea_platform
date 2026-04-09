# Module Development Guide

## Overview
The GIEA Platform uses a modular architecture to enable multiple teams to work independently on different features. Each module is self-contained with its own controllers, routes, middleware, models, and services.

## Module Structure

```
src/modules/[module-name]/
├── controllers/
│   ├── [feature].controller.js
│   └── index.js                 # Export controller
├── routes/
│   ├── [feature].routes.js
│   └── index.js                 # Export routes
├── middleware/
│   ├── [feature].middleware.js
│   └── index.js                 # Export middleware (if needed)
├── models/
│   ├── [feature].model.js
│   └── index.js                 # Export models
├── services/
│   ├── [service].service.js
│   └── index.js                 # Export services
└── index.js                      # Main module export
```

## Creating a New Module

### Step 1: Create the Module Folder
```bash
mkdir src/modules/[module-name]
mkdir src/modules/[module-name]/controllers
mkdir src/modules/[module-name]/routes
mkdir src/modules/[module-name]/middleware
mkdir src/modules/[module-name]/models
mkdir src/modules/[module-name]/services
```

### Step 2: Create Controller (`controllers/[feature].controller.js`)
```javascript
// Example: controllers/user-profile.controller.js
exports.getProfile = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Profile retrieved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Step 3: Create Routes (`routes/[feature].routes.js`)
```javascript
// Example: routes/user-profile.routes.js
const express = require('express');
const controller = require('../controllers/user-profile.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware'); // Or module-specific middleware
const validator = require('../../../utils/helpers'); // Shared utils

const router = express.Router();

router.get('/:id', authMiddleware, controller.getProfile);
router.put('/:id', authMiddleware, controller.updateProfile);

module.exports = router;
```

### Step 4: Create Models (`models/[feature].model.js`)
```javascript
// Example: models/profile.model.js
const admin = require('firebase-admin');

class Profile {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    // ... other properties
  }

  async save() {
    // Save logic
  }

  static async findById(id) {
    // Find logic
  }
}

module.exports = Profile;
```

### Step 5: Create Services (`services/[service].service.js`)
```javascript
// Example: services/profile.service.js
class ProfileService {
  static async processProfile(profileData) {
    // Business logic
    return profileData;
  }
}

module.exports = ProfileService;
```

### Step 6: Create Index Files

**`controllers/index.js`:**
```javascript
module.exports = {
  userProfile: require('./user-profile.controller'),
  // Add other controllers
};
```

**`routes/index.js`:**
```javascript
const express = require('express');
const router = express.Router();

router.use('/profile', require('./user-profile.routes'));
// Add other route groups

module.exports = router;
```

**`services/index.js`:**
```javascript
module.exports = {
  ProfileService: require('./profile.service'),
  // Add other services
};
```

**`models/index.js`:**
```javascript
module.exports = {
  Profile: require('./profile.model'),
  // Add other models
};
```

**`index.js` (Module root):**
```javascript
module.exports = {
  routes: require('./routes'),
  controllers: require('./controllers'),
  middleware: require('./middleware'),
  models: require('./models'),
  services: require('./services'),
};
```

### Step 7: Register Module in Main `src/index.js`
```javascript
// Add after other routes
const [moduleName]Routes = require('./modules/[module-name]/routes');

// ... middleware setup ...

// Add with other routes
app.use('/api/[module-endpoint]', [moduleName]Routes);
```

## Import Paths Reference

### From Within Module:
- Shared utilities: `require('../../../utils/helpers')`
- Shared middleware: `require('../../../middleware/auth.middleware')`
- Shared config: `require('../../../config/database')`
- Module internal: `require('../[subfolder]/[file]')`

### From Authentication Module (Example):
```javascript
// Import authentication user model
const User = require('../modules/authentication/models/user.model');

// Import authentication middleware
const { authMiddleware } = require('../modules/authentication/middleware/auth.middleware');
```

## Team Collaboration Tips

1. **Avoid Cross-Module Dependencies**: Each module should be independent. Use shared utils/middleware instead.
2. **Use Module Exports**: Always export from index.js files for cleaner imports.
3. **Document Your Endpoints**: Add Swagger comments in your routes.
4. **Follow Naming Conventions**: Use descriptive names for controllers (e.g., `user.controller.js`, not `uc.js`)
5. **Test in Isolation**: Each module can be tested independently.

## Current Modules

- ✅ **Authentication** (`src/modules/authentication/`)
  - Register, Login, Email Verification
  - OAuth (Google, Facebook)
  - Token Management
  - User Model

- 📋 **Upcoming Modules** (To be implemented):
  - [Module 2]
  - [Module 3]
  - ... (up to 14 modules)

## API Endpoint Pattern

```
/api/[module-name]/[feature]/[action]

Examples:
/api/auth/register          # Authentication module
/api/auth/login
/api/users/profile          # If using user-management module
/api/projects/create        # If creating projects module
```

## Troubleshooting

### Import Errors
- Check relative paths: `../` moves up one folder
- Use absolute paths from src: `require('./modules/[name]/...')`

### Routes Not Found
- Verify routes are registered in `src/index.js`
- Check module's `routes/index.js` exports correctly

### Middleware Issues
- Ensure middleware is properly used in routes
- Check import paths for shared middleware
