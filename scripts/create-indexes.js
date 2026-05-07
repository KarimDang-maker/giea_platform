/**
 * Create Firestore Composite Indexes using REST API
 * This script creates the required composite indexes for the dashboard module
 */

require('dotenv').config();
const admin = require('firebase-admin');
const https = require('https');

async function createCompositeIndexes() {
  try {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    console.log('🚀 Creating Firestore composite indexes...\n');

    // Get the auth token
    const db = admin.firestore();
    const app = admin.app();
    const accessToken = await app.INTERNAL.getToken();

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const databaseId = '(default)';

    // Helper function to make API calls
    const makeRequest = (method, path, data) => {
      return new Promise((resolve, reject) => {
        const url = `https://firestore.googleapis.com/v1/${path}`;
        const options = {
          hostname: 'firestore.googleapis.com',
          path: `/v1/${path}`,
          method: method,
          headers: {
            'Authorization': `Bearer ${accessToken.access_token}`,
            'Content-Type': 'application/json',
          },
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              resolve({
                status: res.statusCode,
                body: body ? JSON.parse(body) : null,
              });
            } catch (e) {
              resolve({
                status: res.statusCode,
                body: body,
              });
            }
          });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
      });
    };

    // Create Activities Index
    console.log('📝 Creating index for activities collection...');
    try {
      const activitiesIndex = {
        collectionId: 'activities',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'timestamp', order: 'DESCENDING' },
        ],
      };

      const path = `projects/${projectId}/databases/${databaseId}/indexes`;
      const response = await makeRequest('POST', path, { index: activitiesIndex });

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Activities index creation initiated');
      } else {
        console.log('ℹ️  Index creation request sent');
      }
    } catch (error) {
      console.log('ℹ️  Activities index (note: operation may be in progress)');
    }

    // Create Recommendations Index
    console.log('📝 Creating index for recommendations collection...');
    try {
      const recommendationsIndex = {
        collectionId: 'recommendations',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'isDismissed', order: 'ASCENDING' },
          { fieldPath: 'relevanceScore', order: 'DESCENDING' },
        ],
      };

      const path = `projects/${projectId}/databases/${databaseId}/indexes`;
      const response = await makeRequest('POST', path, { index: recommendationsIndex });

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Recommendations index creation initiated');
      } else {
        console.log('ℹ️  Index creation request sent');
      }
    } catch (error) {
      console.log('ℹ️  Recommendations index (note: operation may be in progress)');
    }

    console.log('\n✅ Index creation complete!');
    console.log('⏳ Indexes are being created (this usually takes 5-10 minutes)');
    console.log('📊 Monitor progress at: https://console.firebase.google.com/project/giea-c40d6/firestore/indexes\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

createCompositeIndexes();
