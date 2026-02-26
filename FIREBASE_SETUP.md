# Firebase Realtime Database Setup Guide

## Prerequisites

1. A Google account
2. Firebase project `edulift-2a722` already created

## Step-by-Step Setup

### 1. Open Firebase Console
- Go to [https://console.firebase.google.com](https://console.firebase.google.com)
- Sign in with your Google account

### 2. Navigate to Realtime Database
- Select your project `edulift-2a722`
- From the left sidebar, click on **Realtime Database**

### 3. Create Database
- Click on **Create Database**
- Choose **Test mode** for development (recommended for now)
- Select your region (e.g., us-central1)
- Click **Enable**

### 4. Verify Database URL
- After creation, you should see a database URL like:
  `https://edulift-2a722-default-rtdb.firebaseio.com/`

### 5. Update Security Rules (Optional but Recommended)

For development purposes, the default test rules are:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, you should restrict access. Example rules:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "test": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Testing the Database

### Method 1: Test File (Recommended)

Open `test_database.html` in your browser. This file provides:

1. **Connection Test**: Checks if your app can connect to Firebase
2. **Write Test**: Creates test data in the database
3. **Read Test**: Reads and displays test data

The page will automatically test the connection when loaded. You can also click the buttons to test manually.

### Method 2: Browser Console

Open `index.html` and check the browser console (F12 > Console). Look for:

```
Database connection successful. Test data: {...}
```

or

```
Database connection successful. No test data found. Creating test data...
```

### Method 3: Sign Up/Sign In Flow

1. Open `index.html`
2. Click **Sign Up** and create a new account
3. Check the Firebase Realtime Database console - you should see a `users/[user-id]` node with the user's data

## Database Structure

```
edulift-2a722-default-rtdb
├── test/
│   ├── timestamp: "2024-01-01T00:00:00.000Z"
│   ├── message: "Firebase Realtime Database connection test successful!"
│   └── project: "Edulift"
└── users/
    └── [user-uid]/
        ├── fullName: "John Doe"
        ├── email: "john@example.com"
        ├── phone: "1234567890"
        └── createdAt: "2024-01-01T00:00:00.000Z"
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check if your security rules allow read/write operations
2. **Database Not Found**: Verify the `databaseURL` in your `firebaseConfig`
3. **Connection Timeout**: Check your internet connection
4. **CORS Errors**: Make sure you're serving your files over HTTP/HTTPS (not file:// protocol)

### Checking Console Logs

Open your browser's developer tools (F12) and check the Console tab for detailed error messages.

## Next Steps

1. Add more data to your database
2. Implement real-time listeners for dynamic content updates
3. Set up proper security rules for production
4. Explore other Firebase features (Cloud Functions, Storage, etc.)

## Resources

- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase JavaScript Reference](https://firebase.google.com/docs/reference/js)