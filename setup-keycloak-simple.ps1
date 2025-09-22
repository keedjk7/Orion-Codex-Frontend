# Simple Keycloak Setup Script for Orion
param(
    [string]$KeycloakUrl = "http://localhost:8080"
)

Write-Host "Setting up Keycloak for Orion..." -ForegroundColor Green

# Check if Keycloak is running
try {
    $response = Invoke-WebRequest -Uri $KeycloakUrl -UseBasicParsing -TimeoutSec 10
    Write-Host "Keycloak is running" -ForegroundColor Green
}
catch {
    Write-Host "Keycloak is not running at $KeycloakUrl" -ForegroundColor Red
    Write-Host "Please start Keycloak first with: docker-compose up -d keycloak" -ForegroundColor Yellow
    exit 1
}

# Get admin token
$body = @{
    username = "admin"
    password = "admin"
    grant_type = "password"
    client_id = "admin-cli"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri "$KeycloakUrl/realms/master/protocol/openid-connect/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
    $AdminToken = $tokenResponse.access_token
    Write-Host "Admin token obtained" -ForegroundColor Green
}
catch {
    Write-Host "Failed to get admin token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create realm
$realmData = @{
    realm = "orion"
    enabled = $true
    displayName = "Orion AI Finance Platform"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $AdminToken"
    "Content-Type" = "application/json"
}

try {
    Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms" -Method Post -Body $realmData -Headers $headers
    Write-Host "Realm 'orion' created successfully" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Realm 'orion' already exists" -ForegroundColor Yellow
    }
    else {
        Write-Host "Failed to create realm: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create client
$clientData = @{
    clientId = "orion-client"
    name = "Orion Client"
    enabled = $true
    publicClient = $true
    standardFlowEnabled = $true
    directAccessGrantsEnabled = $true
    rootUrl = "http://localhost:5000"
    redirectUris = @("http://localhost:5000/*")
    webOrigins = @("http://localhost:5000")
    attributes = @{
        "pkce.code.challenge.method" = "S256"
    }
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms/orion/clients" -Method Post -Body $clientData -Headers $headers
    Write-Host "Client 'orion-client' created successfully" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Client 'orion-client' already exists" -ForegroundColor Yellow
    }
    else {
        Write-Host "Failed to create client: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create test user
$userData = @{
    username = "testuser"
    email = "test@orion.com"
    firstName = "Test"
    lastName = "User"
    enabled = $true
    emailVerified = $true
    credentials = @(
        @{
            type = "password"
            value = "password123"
            temporary = $false
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$KeycloakUrl/admin/realms/orion/users" -Method Post -Body $userData -Headers $headers
    Write-Host "Test user 'testuser' created successfully" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "Test user 'testuser' already exists" -ForegroundColor Yellow
    }
    else {
        Write-Host "Failed to create test user: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Keycloak setup completed!" -ForegroundColor Green
Write-Host "Test User: testuser / password123" -ForegroundColor Cyan
Write-Host "Orion App: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Keycloak Admin: http://localhost:8080 (admin/admin)" -ForegroundColor Cyan
