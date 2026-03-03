#!/bin/bash

# Firebase Auth & Database Live Test Script
# Testing with Firebase Auth REST API and Realtime Database REST API

FIREBASE_API_KEY="AIzaSyDNgIWKNESwLeL8unyI1Pgr_oqgtFy2c0s"
FIREBASE_DB_URL="https://edulift-dac4d-default-rtdb.firebaseio.com"
TEST_USERNAME="testuser2026"
TEST_EMAIL="testuser2026@edulift.com"
TEST_PASSWORD="TestPass123!"

echo "========================================="
echo "Firebase Auth & Database Live Test"
echo "========================================="
echo ""

# Test 1: Sign Up via Firebase Auth REST API
echo "1. Testing Sign-Up Flow..."
echo "   Creating user: $TEST_USERNAME"
echo ""

SIGNUP_RESPONSE=$(curl -s -X POST \
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$FIREBASE_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"returnSecureToken\": true
  }")

echo "   Sign-Up Response:"
echo "$SIGNUP_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SIGNUP_RESPONSE"
echo ""

# Check if sign-up was successful
if echo "$SIGNUP_RESPONSE" | grep -q '"idToken"'; then
    echo "   ✅ Sign-Up: SUCCESS"
    ID_TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['idToken'])")
    UID=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['localId'])")
    echo "   UID: $UID"
    
    # Test 2: Write user data to Realtime Database
    echo ""
    echo "2. Testing Realtime Database Write..."
    
    DB_WRITE_RESPONSE=$(curl -s -X PUT \
      "$FIREBASE_DB_URL/users/$UID.json" \
      -d "{
        \"username\": \"$TEST_USERNAME\",
        \"email\": \"$TEST_EMAIL\",
        \"createdAt\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
      }")
    
    echo "   Database Write Response: $DB_WRITE_RESPONSE"
    
    if echo "$DB_WRITE_RESPONSE" | grep -q "$TEST_USERNAME"; then
        echo "   ✅ Database Write: SUCCESS"
    else
        echo "   ❌ Database Write: FAILED"
    fi
    
    # Test 3: Verify data in Realtime Database
    echo ""
    echo "3. Verifying User Data in Realtime Database..."
    
    DB_READ_RESPONSE=$(curl -s "$FIREBASE_DB_URL/users/$UID.json")
    
    echo "   Database Read Response:"
    echo "$DB_READ_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DB_READ_RESPONSE"
    
    if echo "$DB_READ_RESPONSE" | grep -q "$TEST_USERNAME"; then
        echo "   ✅ Database Read: SUCCESS - User data found!"
    else
        echo "   ❌ Database Read: FAILED - User data not found"
    fi
    
    # Test 4: Test Login
    echo ""
    echo "4. Testing Login Flow..."
    
    LOGIN_RESPONSE=$(curl -s -X POST \
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$FIREBASE_API_KEY" \
      -H 'Content-Type: application/json' \
      -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"returnSecureToken\": true
      }")
    
    echo "   Login Response:"
    echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
    
    if echo "$LOGIN_RESPONSE" | grep -q '"idToken"'; then
        echo "   ✅ Login: SUCCESS"
    else
        echo "   ❌ Login: FAILED"
    fi
    
    # Test 5: Get all users from database
    echo ""
    echo "5. Checking All Users in Database..."
    
    ALL_USERS=$(curl -s "$FIREBASE_DB_URL/users.json")
    
    echo "   Users in database (showing structure):"
    echo "$ALL_USERS" | python3 -m json.tool 2>/dev/null || echo "$ALL_USERS"
    
else
    echo "   ❌ Sign-Up: FAILED"
    if echo "$SIGNUP_RESPONSE" | grep -q '"error"'; then
        ERROR_MESSAGE=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['error']['message'])" 2>/dev/null)
        echo "   Error: $ERROR_MESSAGE"
        
        # If user already exists, try login anyway
        if echo "$ERROR_MESSAGE" | grep -qi "email exists"; then
            echo ""
            echo "   User already exists. Testing login with existing user..."
            
            LOGIN_RESPONSE=$(curl -s -X POST \
              "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$FIREBASE_API_KEY" \
              -H 'Content-Type: application/json' \
              -d "{
                \"email\": \"$TEST_EMAIL\",
                \"password\": \"$TEST_PASSWORD\",
                \"returnSecureToken\": true
              }")
            
            echo "   Login Response:"
            echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
            
            if echo "$LOGIN_RESPONSE" | grep -q '"idToken"'; then
                echo "   ✅ Login with existing user: SUCCESS"
                UID=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['localId'])")
                
                # Check if user data exists in database
                echo ""
                echo "   Checking user data in database..."
                USER_DATA=$(curl -s "$FIREBASE_DB_URL/users/$UID.json")
                echo "   User data: $USER_DATA"
            else
                echo "   ❌ Login: FAILED"
            fi
        fi
    fi
fi

echo ""
echo "========================================="
echo "Test Complete"
echo "========================================="
