/**
 * Create Firestore Indexes using Google Cloud Firestore Admin API
 * This directly creates composite indexes without Firebase CLI
 */

require('dotenv').config();
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

async function createIndexes() {
  try {
    console.log('🚀 Creating Firestore composite indexes...\n');

    // Set up service account credentials
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

    // Create auth client
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Get access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)`;
    const indexUrl = `${baseUrl}/indexes`;

    console.log('🔐 Using project:', projectId);
    console.log('📡 API endpoint:', indexUrl);
    console.log('🔑 Token obtained:', !!accessToken.token, '\n');

    // Index 1: Activities (userId + timestamp)
    console.log('📝 Creating Activities Index (userId + timestamp)...');
    try {
      const activitiesIndex = {
        collectionId: 'activities',
        queryScope: 'COLLECTION',
        fields: [
          {
            fieldPath: 'userId',
            order: 'ASCENDING'
          },
          {
            fieldPath: 'timestamp',
            order: 'DESCENDING'
          }
        ]
      };

      const response1 = await axios.post(
        indexUrl,
        { index: activitiesIndex },
        {
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Activities index creation initiated');
      console.log(`   Operation: ${response1.data.name}\n`);
    } catch (error) {
      if (error.response?.status === 409 || error.message.includes('already exists')) {
        console.log('ℹ️  Activities index already exists\n');
      } else {
        console.log('⚠️  Could not create activities index');
        if (error.response?.data?.error) {
          console.log('   Error:', error.response.data.error.message, '\n');
        } else {
          console.log('   Error:', error.message, '\n');
        }
      }
    }

    // Index 2: Recommendations (userId + isDismissed + relevanceScore)
    console.log('📝 Creating Recommendations Index (userId + isDismissed + relevanceScore)...');
    try {
      const recommendationsIndex = {
        collectionId: 'recommendations',
        queryScope: 'COLLECTION',
        fields: [
          {
            fieldPath: 'userId',
            order: 'ASCENDING'
          },
          {
            fieldPath: 'isDismissed',
            order: 'ASCENDING'
          },
          {
            fieldPath: 'relevanceScore',
            order: 'DESCENDING'
          }
        ]
      };

      const response2 = await axios.post(
        indexUrl,
        { index: recommendationsIndex },
        {
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Recommendations index creation initiated');
      console.log(`   Operation: ${response2.data.name}\n`);
    } catch (error) {
      if (error.response?.status === 409 || error.message.includes('already exists')) {
        console.log('ℹ️  Recommendations index already exists\n');
      } else {
        console.log('⚠️  Could not create recommendations index:', error.response?.data?.error?.message || error.message, '\n');
      }
    }

    console.log('✅ Index creation requests submitted!');
    console.log('⏳ Indexes are being built (check Firebase Console in 5-10 minutes)');
    console.log('📊 Monitor at: https://console.firebase.google.com/project/giea-c40d6/firestore/databases/-default-/indexes\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createIndexes();
