const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');

// This test script needs a service account key from Firebase Console
// Instructions to get service account key:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (edulift-dac4d)
// 3. Go to Project Settings > Service Accounts
// 4. Click "Generate new private key"
// 5. Save the JSON file as serviceAccountKey.json in the project root

async function testFirebaseConnection() {
    try {
        console.log('Testing Firebase Realtime Database connection...');
        
        // Try to read the service account key
        let serviceAccount;
        try {
            serviceAccount = require('./serviceAccountKey.json');
        } catch (error) {
            console.log('Service account key not found. Skipping authenticated test.');
            return;
        }
        
        // Initialize Firebase Admin SDK
        const app = initializeApp({
            credential: cert(serviceAccount),
            databaseURL: 'https://edulift-dac4d-default-rtdb.firebaseio.com'
        });
        
        console.log('Firebase Admin SDK initialized successfully');
        
        // Get database reference
        const db = getDatabase(app);
        
        // Test connection by writing and reading data
        const testRef = db.ref('test-connection');
        const testData = {
            timestamp: new Date().toISOString(),
            message: 'Firebase Realtime Database connection test',
            testId: Math.floor(Math.random() * 1000)
        };
        
        // Write test data
        console.log('Writing test data...');
        await testRef.set(testData);
        console.log('Test data written successfully');
        
        // Read test data
        console.log('Reading test data...');
        const snapshot = await testRef.get();
        if (snapshot.exists()) {
            console.log('Test data read successfully:', snapshot.val());
        } else {
            console.log('No test data found');
        }
        
        // Cleanup - remove test data
        console.log('Cleaning up test data...');
        await testRef.remove();
        
        console.log('\n✅ Firebase Realtime Database integration test passed!');
        
    } catch (error) {
        console.error('\n❌ Firebase connection test failed:', error.message);
        console.error('Error details:', error);
    }
}

// Test without service account (simulates client-side)
async function testPublicAccess() {
    console.log('\nTesting public access to Firebase Realtime Database...');
    
    // For client-side tests, we would normally use the regular Firebase SDK
    // For this test, we'll try to access the database directly using REST API
    
    try {
        const response = await fetch('https://edulift-dac4d-default-rtdb.firebaseio.com/.json');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Public access allowed. Database contents:', data);
        } else {
            console.log(`❌ Public access failed with status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Error accessing database publicly:', error.message);
    }
}

// Run tests
async function runAllTests() {
    await testFirebaseConnection();
    await testPublicAccess();
}

runAllTests();
