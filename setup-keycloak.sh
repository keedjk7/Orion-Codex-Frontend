#!/bin/bash

# Keycloak Setup Script for Orion
# This script automatically configures Keycloak realm, client, and test user

set -e

KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin"
REALM_NAME="orion"
CLIENT_ID="orion-client"
TEST_USERNAME="testuser"
TEST_PASSWORD="password123"
TEST_EMAIL="test@orion.com"

echo "🚀 Setting up Keycloak for Orion..."

# Function to get admin token
get_admin_token() {
    echo "🔑 Getting admin token..."
    ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$ADMIN_USER" \
        -d "password=$ADMIN_PASSWORD" \
        -d "grant_type=password" \
        -d "client_id=admin-cli" | \
        jq -r '.access_token')
    
    if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
        echo "❌ Failed to get admin token. Make sure Keycloak is running and credentials are correct."
        exit 1
    fi
    echo "✅ Admin token obtained"
}

# Function to create realm
create_realm() {
    echo "🏰 Creating realm: $REALM_NAME..."
    
    REALM_DATA='{
        "realm": "'$REALM_NAME'",
        "enabled": true,
        "displayName": "Orion AI Finance Platform",
        "displayNameHtml": "<div class=\"kc-logo-text\"><span>Orion AI Finance Platform</span></div>",
        "registrationAllowed": false,
        "registrationEmailAsUsername": false,
        "rememberMe": true,
        "verifyEmail": false,
        "loginWithEmailAllowed": true,
        "duplicateEmailsAllowed": false,
        "resetPasswordAllowed": true,
        "editUsernameAllowed": false,
        "bruteForceProtected": true
    }'
    
    RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/realm_response.json -X POST \
        "$KEYCLOAK_URL/admin/realms" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$REALM_DATA")
    
    if [ "$RESPONSE" == "201" ]; then
        echo "✅ Realm '$REALM_NAME' created successfully"
    elif [ "$RESPONSE" == "409" ]; then
        echo "⚠️  Realm '$REALM_NAME' already exists"
    else
        echo "❌ Failed to create realm. HTTP status: $RESPONSE"
        cat /tmp/realm_response.json
        exit 1
    fi
}

# Function to create client
create_client() {
    echo "🔧 Creating client: $CLIENT_ID..."
    
    CLIENT_DATA='{
        "clientId": "'$CLIENT_ID'",
        "name": "Orion AI Finance Platform Client",
        "description": "Main client for Orion AI Finance Platform",
        "enabled": true,
        "clientAuthenticatorType": "client-secret",
        "publicClient": true,
        "protocol": "openid-connect",
        "standardFlowEnabled": true,
        "directAccessGrantsEnabled": true,
        "serviceAccountsEnabled": false,
        "authorizationServicesEnabled": false,
        "rootUrl": "http://localhost:5000",
        "baseUrl": "http://localhost:5000",
        "adminUrl": "http://localhost:5000",
        "redirectUris": [
            "http://localhost:5000/*"
        ],
        "postLogoutRedirectUris": [
            "http://localhost:5000/*"
        ],
        "webOrigins": [
            "http://localhost:5000"
        ],
        "attributes": {
            "pkce.code.challenge.method": "S256"
        }
    }'
    
    RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/client_response.json -X POST \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$CLIENT_DATA")
    
    if [ "$RESPONSE" == "201" ]; then
        echo "✅ Client '$CLIENT_ID' created successfully"
    elif [ "$RESPONSE" == "409" ]; then
        echo "⚠️  Client '$CLIENT_ID' already exists"
    else
        echo "❌ Failed to create client. HTTP status: $RESPONSE"
        cat /tmp/client_response.json
        exit 1
    fi
}

# Function to create test user
create_test_user() {
    echo "👤 Creating test user: $TEST_USERNAME..."
    
    USER_DATA='{
        "username": "'$TEST_USERNAME'",
        "email": "'$TEST_EMAIL'",
        "firstName": "Test",
        "lastName": "User",
        "enabled": true,
        "emailVerified": true,
        "credentials": [{
            "type": "password",
            "value": "'$TEST_PASSWORD'",
            "temporary": false
        }]
    }'
    
    RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/user_response.json -X POST \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$USER_DATA")
    
    if [ "$RESPONSE" == "201" ]; then
        echo "✅ Test user '$TEST_USERNAME' created successfully"
        echo "📧 Email: $TEST_EMAIL"
        echo "🔑 Password: $TEST_PASSWORD"
    elif [ "$RESPONSE" == "409" ]; then
        echo "⚠️  Test user '$TEST_USERNAME' already exists"
        echo "📧 Email: $TEST_EMAIL"
        echo "🔑 Password: $TEST_PASSWORD"
    else
        echo "❌ Failed to create test user. HTTP status: $RESPONSE"
        cat /tmp/user_response.json
        exit 1
    fi
}

# Main execution
echo "🔍 Checking if Keycloak is running..."
if ! curl -s "$KEYCLOAK_URL" > /dev/null; then
    echo "❌ Keycloak is not running or not accessible at $KEYCLOAK_URL"
    echo "💡 Please start Keycloak first with: docker-compose up -d keycloak"
    exit 1
fi

echo "✅ Keycloak is running"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed."
    echo "💡 Please install jq: https://stedolan.github.io/jq/download/"
    exit 1
fi

# Execute setup steps
get_admin_token
create_realm
create_client
create_test_user

# Cleanup temp files
rm -f /tmp/realm_response.json /tmp/client_response.json /tmp/user_response.json

echo ""
echo "🎉 Keycloak setup completed successfully!"
echo ""
echo "📋 Configuration Summary:"
echo "  🏰 Realm: $REALM_NAME"
echo "  🔧 Client ID: $CLIENT_ID"
echo "  👤 Test User: $TEST_USERNAME"
echo "  🔑 Test Password: $TEST_PASSWORD"
echo "  📧 Test Email: $TEST_EMAIL"
echo ""
echo "🌐 Access URLs:"
echo "  📱 Orion App: http://localhost:5000"
echo "  🛡️  Keycloak Admin: http://localhost:8080 (admin/admin)"
echo ""
echo "✨ You can now test the authentication flow!"
echo "   1. Go to http://localhost:5000"
echo "   2. Try to access any protected page (e.g., /dashboard)"
echo "   3. Login with: $TEST_USERNAME / $TEST_PASSWORD"
echo "   4. You should be redirected back to the page you wanted to access"
