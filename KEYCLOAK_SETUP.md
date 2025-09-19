# Keycloak Setup Guide for Orion

## Overview
This guide will help you set up Keycloak authentication for the Orion AI Finance Platform.

## Prerequisites
- Docker installed on your system
- Node.js and npm installed

## 1. Start Keycloak Server

### Using Docker (Recommended)
```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### Using Docker Compose (Alternative)
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    command: start-dev
```

Then run:
```bash
docker-compose up -d
```

## 2. Access Keycloak Admin Console
1. Open your browser and go to: `http://localhost:8080`
2. Click on "Administration Console"
3. Login with:
   - Username: `admin`
   - Password: `admin`

## 3. Create a Realm
1. In the admin console, click on the dropdown next to "Master" in the top-left
2. Click "Create Realm"
3. Enter realm name: `orion`
4. Click "Create"

## 4. Create a Client
1. In the `orion` realm, go to "Clients" in the left sidebar
2. Click "Create client"
3. Fill in the details:
   - **Client type**: OpenID Connect
   - **Client ID**: `orion-client`
   - Click "Next"
4. Configure client settings:
   - **Client authentication**: OFF (public client)
   - **Authorization**: OFF
   - **Standard flow**: ON
   - **Direct access grants**: ON
   - Click "Next"
5. Configure login settings:
   - **Root URL**: `http://localhost:5000`
   - **Home URL**: `http://localhost:5000`
   - **Valid redirect URIs**: `http://localhost:5000/*`
   - **Valid post logout redirect URIs**: `http://localhost:5000/*`
   - **Web origins**: `http://localhost:5000`
   - Click "Save"

## 5. Configure Client Settings (Advanced)
1. Go to the `orion-client` settings
2. In the "Advanced" tab, set:
   - **Proof Key for Code Exchange Code Challenge Method**: S256

## 6. Create Test Users (Optional)
1. Go to "Users" in the left sidebar
2. Click "Create new user"
3. Fill in user details:
   - **Username**: `testuser`
   - **Email**: `test@orion.com`
   - **First name**: `Test`
   - **Last name**: `User`
   - **Email verified**: ON
   - Click "Create"
4. Set password:
   - Go to "Credentials" tab
   - Click "Set password"
   - Enter password: `password123`
   - Set "Temporary": OFF
   - Click "Save"

## 7. Environment Variables
Create a `.env` file in your project root:
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=orion
VITE_KEYCLOAK_CLIENT_ID=orion-client
```

## 8. Test the Integration
1. Start your Orion application:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5000`
3. Click "Get Started" or "Sign In"
4. You should see the authentication popup
5. Click "Sign in with Keycloak"
6. You'll be redirected to Keycloak login page
7. Login with your test user credentials
8. You should be redirected back to Orion with authentication

## Production Configuration

### For Production Deployment:
1. Use a proper database (PostgreSQL recommended) instead of H2
2. Configure HTTPS/SSL certificates
3. Set up proper realm and client configurations
4. Configure user federation (LDAP/Active Directory) if needed
5. Set up proper backup and monitoring

### Environment Variables for Production:
```env
VITE_KEYCLOAK_URL=https://your-keycloak-domain.com
VITE_KEYCLOAK_REALM=orion-prod
VITE_KEYCLOAK_CLIENT_ID=orion-client-prod
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure Web origins is set to your application URL
2. **Redirect errors**: Check Valid redirect URIs configuration
3. **Token refresh issues**: Ensure client is configured as public client
4. **Silent SSO not working**: Make sure `silent-check-sso.html` is accessible

### Debug Mode:
Add this to your Keycloak configuration for debugging:
```typescript
// In keycloak.ts
keycloak.onReady = (authenticated) => {
  console.log('Keycloak ready, authenticated:', authenticated);
};

keycloak.onAuthSuccess = () => {
  console.log('Authentication successful');
};

keycloak.onAuthError = (error) => {
  console.error('Authentication error:', error);
};
```

## Security Considerations
1. Always use HTTPS in production
2. Configure proper CORS settings
3. Set up rate limiting
4. Regular security updates
5. Monitor authentication logs
6. Use strong passwords and MFA when possible

## Additional Resources
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [OpenID Connect Specification](https://openid.net/connect/)
