/**
 * Firestore Setup Script
 * Creates the activities collection and sample data
 * This script will initialize the activities collection in Firestore
 */

require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
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
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

async function setupFirestore() {
  try {
    console.log('🚀 Starting Firestore setup...\n');

    // Create activities collection with sample data
    console.log('📝 Creating activities collection...');
    const activitiesRef = db.collection('activities');
    
    // Add sample activity documents to create the collection
    const sampleActivities = [
      {
        userId: 'sample-user-123',
        type: 'project_created',
        description: 'Project "Sample Project" was created',
        timestamp: new Date(),
        isRead: false,
        createdAt: new Date(),
        metadata: {
          projectId: 'proj-123',
          projectName: 'Sample Project'
        }
      },
      {
        userId: 'sample-user-123',
        type: 'project_updated',
        description: 'Project "Sample Project" was updated',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        createdAt: new Date(Date.now() - 3600000),
        metadata: {
          projectId: 'proj-123'
        }
      }
    ];

    for (const activity of sampleActivities) {
      await activitiesRef.add(activity);
      console.log(`  ✅ Added sample activity: ${activity.description}`);
    }

    // Create recommendations collection with sample data
    console.log('\n📝 Creating recommendations collection...');
    const recommendationsRef = db.collection('recommendations');
    
    const sampleRecommendations = [
      {
        userId: 'sample-user-123',
        type: 'optimization',
        title: 'Optimize your project',
        description: 'Consider adding team members to your project',
        relevanceScore: 0.9,
        isDismissed: false,
        expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        createdAt: new Date()
      }
    ];

    for (const rec of sampleRecommendations) {
      await recommendationsRef.add(rec);
      console.log(`  ✅ Added sample recommendation: ${rec.title}`);
    }

    console.log('\n✅ Firestore collections created successfully!\n');
    console.log('📌 IMPORTANT: You still need to create the composite indexes in Firebase Console.\n');
    console.log('Create these indexes:\n');
    console.log('1️⃣  ACTIVITIES INDEX:');
    console.log('   Collection: activities');
    console.log('   Field 1: userId (Ascending)');
    console.log('   Field 2: timestamp (Descending)');
    console.log('\n2️⃣  RECOMMENDATIONS INDEX:');
    console.log('   Collection: recommendations');
    console.log('   Field 1: userId (Ascending)');
    console.log('   Field 2: isDismissed (Ascending)');
    console.log('   Field 3: relevanceScore (Descending)\n');
    console.log('📖 Steps:');
    console.log('   1. Go to Firebase Console → Firestore Database → Indexes');
    console.log('   2. Click "Create Index"');
    console.log('   3. Fill in the fields as shown above');
    console.log('   4. Click "Create"\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
    process.exit(1);
  }
}

setupFirestore();
