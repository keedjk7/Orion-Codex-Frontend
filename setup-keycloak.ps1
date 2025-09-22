# Keycloak Setup Script for Orion (PowerShell)
# This script automatically configures Keycloak realm, client, and test user

param(
    [string]$KeycloakUrl = "http://localhost:8080",
    [string]$AdminUser = "admin",
    [string]$AdminPassword = "admin",
    [string]$RealmName = "orion",
    [string]$ClientId = "orion-client",
    [string]$TestUsername = "testuser",
    [string]$TestPassword = "password123",
    [string]$TestEmail = "test@orion.com"
)

Write-Host "🚀 Setting up Keycloak for Orion..." -ForegroundColor Green

# Function to get admin token
function Get-AdminToken {
    Write-Host "🔑 Getting admin token..." -ForegroundColor Yellow
    
    $body = @{
        username = $AdminUser
        password = $AdminPassword
        grant_type = "password"
        client_id = "admin-cli"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$KeycloakUrl/realms/master/protocol/openid-connect/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
        $script:AdminToken = $response.access_token
        Write-Host "✅ Admin token obtained" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to get admin token: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to create realm
function Create-Realm {
    Write-Host "🏰 Creating realm: $RealmName..." -ForegroundColor Yellow
    
    $realmData = @{
        realm = $RealmName
        enabled = $true
        displayName = "Orion AI Finance Platform"
        displayNameHtml = "<div class='kc-logo-text'><span>Orion AI Finance Platform</span></div>"
        registrationAllowed = $false
        registrationEmailAsUsername = $false
        rememberMe = $true
        verifyEmail = $false
        loginWithEmailAllowed = $true
        duplicateEmailsAllowed = $false
        resetPasswordAllowed = $true
        editUsernameAllowed = $false
        bruteForceProtected = $true
    } | ConvertTo-Json -Depth 10
    
    $headers = @{
        Authorization = "Bearer $AdminToken"
        "Content-Type" = "application/json"
    }
    
    try {
        Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms" -Method Post -Body $realmData -Headers $headers
        Write-Host "✅ Realm '$RealmName' created successfully" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "⚠️  Realm '$RealmName' already exists" -ForegroundColor Yellow
        }
        else {
            Write-Host "❌ Failed to create realm: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Function to create client
function Create-Client {
    Write-Host "🔧 Creating client: $ClientId..." -ForegroundColor Yellow
    
    $clientData = @{
        clientId = $ClientId
        name = "Orion AI Finance Platform Client"
        description = "Main client for Orion AI Finance Platform"
        enabled = $true
        clientAuthenticatorType = "client-secret"
        publicClient = $true
        protocol = "openid-connect"
        standardFlowEnabled = $true
        directAccessGrantsEnabled = $true
        serviceAccountsEnabled = $false
        authorizationServicesEnabled = $false
        rootUrl = "http://localhost:5000"
        baseUrl = "http://localhost:5000"
        adminUrl = "http://localhost:5000"
        redirectUris = @("http://localhost:5000/*")
        postLogoutRedirectUris = @("http://localhost:5000/*")
        webOrigins = @("http://localhost:5000")
        attributes = @{
            "pkce.code.challenge.method" = "S256"
        }
    } | ConvertTo-Json -Depth 10
    
    $headers = @{
        Authorization = "Bearer $AdminToken"
        "Content-Type" = "application/json"
    }
    
    try {
        Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms/$RealmName/clients" -Method Post -Body $clientData -Headers $headers
        Write-Host "✅ Client '$ClientId' created successfully" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "⚠️  Client '$ClientId' already exists" -ForegroundColor Yellow
        }
        else {
            Write-Host "❌ Failed to create client: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Function to create test user
function Create-TestUser {
    Write-Host "👤 Creating test user: $TestUsername..." -ForegroundColor Yellow
    
    $userData = @{
        username = $TestUsername
        email = $TestEmail
        firstName = "Test"
        lastName = "User"
        enabled = $true
        emailVerified = $true
        credentials = @(
            @{
                type = "password"
                value = $TestPassword
                temporary = $false
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $headers = @{
        Authorization = "Bearer $AdminToken"
        "Content-Type" = "application/json"
    }
    
    try {
        Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms/$RealmName/users" -Method Post -Body $userData -Headers $headers
        Write-Host "✅ Test user '$TestUsername' created successfully" -ForegroundColor Green
        Write-Host "📧 Email: $TestEmail" -ForegroundColor Cyan
        Write-Host "🔑 Password: $TestPassword" -ForegroundColor Cyan
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "⚠️  Test user '$TestUsername' already exists" -ForegroundColor Yellow
            Write-Host "📧 Email: $TestEmail" -ForegroundColor Cyan
            Write-Host "🔑 Password: $TestPassword" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Failed to create test user: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Main execution
Write-Host "🔍 Checking if Keycloak is running..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $KeycloakUrl -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Keycloak is running" -ForegroundColor Green
}
catch {
    Write-Host "❌ Keycloak is not running or not accessible at $KeycloakUrl" -ForegroundColor Red
    Write-Host "💡 Please start Keycloak first with: docker-compose up -d keycloak" -ForegroundColor Yellow
    exit 1
}

# Execute setup steps
if (-not (Get-AdminToken)) { exit 1 }
if (-not (Create-Realm)) { exit 1 }
if (-not (Create-Client)) { exit 1 }
if (-not (Create-TestUser)) { exit 1 }

Write-Host ""
Write-Host "🎉 Keycloak setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor Cyan
Write-Host "  🏰 Realm: $RealmName" -ForegroundColor White
Write-Host "  🔧 Client ID: $ClientId" -ForegroundColor White
Write-Host "  👤 Test User: $TestUsername" -ForegroundColor White
Write-Host "  🔑 Test Password: $TestPassword" -ForegroundColor White
Write-Host "  📧 Test Email: $TestEmail" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "  📱 Orion App: http://localhost:5000" -ForegroundColor White
Write-Host "  🛡️  Keycloak Admin: http://localhost:8080 (admin/admin)" -ForegroundColor White
Write-Host ""
Write-Host "✨ You can now test the authentication flow!" -ForegroundColor Green
Write-Host "   1. Go to http://localhost:5000" -ForegroundColor White
Write-Host "   2. Try to access any protected page (e.g., /dashboard)" -ForegroundColor White
Write-Host "   3. Login with: $TestUsername / $TestPassword" -ForegroundColor White
Write-Host "   4. You should be redirected back to the page you wanted to access" -ForegroundColor White
