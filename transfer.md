# Transfer Guide: Moving Files & Modules

## 1. Moving shrink.md
To move the `shrink.md` file to the `doc/` directory:
```bash
mv shrink.md doc/
```

## 2. Migrating the Marketplace Module
The Marketplace module is designed to be "singular" and modular. To move it to another Express application, follow these steps:

### Step A: Copy the Module Files
Copy the entire `src/modules/marketplace` directory to the target application's modules folder.

### Step B: Dependencies Check
The module depends on some global components. Ensure the target app has:
1. **Firestore Configuration**: A `config/database.js` file exporting `admin` and `db`.
2. **Global Middleware**: `auth.middleware.js` and `role.middleware.js`.
3. **Global Utils**: `utils/helpers.js` providing `sendError` and `sendSuccess`.

> [!TIP]
> If the target app has a different structure, you may need to update the relative imports in the Marketplace controllers, routes, and services.

### Step C: Registration
In your target `src/index.js` (or entry point), plug in the module:

```javascript
// 1. Import the routes from the module
const { routes: marketplaceRoutes } = require('./modules/marketplace');

// 2. Register the routes
app.use('/api/marketplace', marketplaceRoutes);
```

### Step D: Required Environment Variables
Ensure the following variables are defined in the target `.env`:
- `SESSION_SECRET` (if using sessions)
- Google Cloud / Firebase credentials (via environment or service account file)
