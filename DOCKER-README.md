# 🐳 Docker Setup for Orion Keycloak Integration

This guide will help you set up Keycloak authentication service using Docker for the Orion Login System.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning)
- Node.js 18+ (for development)

### 1. Start Keycloak Services

**Windows:**
```bash
scripts\start-keycloak.bat
```

**Linux/Mac:**
```bash
./scripts/start-keycloak.sh
```

### 2. Configure Environment

Create `.env` file (automatically created by start script):
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=orion
VITE_KEYCLOAK_CLIENT_ID=orion-client
```

### 3. Start Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:5173`

## 🔧 Services

### Keycloak Admin Console
- **URL:** http://localhost:8080
- **Username:** `admin`
- **Password:** `admin123`

### PostgreSQL Database
- **Host:** localhost:5432
- **Database:** keycloak
- **Username:** keycloak
- **Password:** keycloak123

### Test User Accounts
| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin123 | Administrator | admin@orion.com |
| testuser | test123 | Standard User | test@orion.com |
| demo | demo123 | Demo Account | demo@orion.com |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Keycloak      │    │   PostgreSQL    │
│   (React)       │◄──►│   (Auth)        │◄──►│   (Database)    │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📝 How It Works

### Authentication Flow
1. **Startup:** System checks for stored tokens
2. **No Token:** Attempts Keycloak connection
3. **Keycloak Available:** Uses real authentication
4. **Keycloak Unavailable:** Falls back to demo accounts
5. **Login Success:** Stores JWT token and user info

### Configuration Priority
1. **Real Keycloak** (if VITE_KEYCLOAK_URL is set)
2. **Demo Accounts** (fallback for development)

## 🛠️ Development Commands

### Docker Management
```bash
# Start all services
docker-compose up -d

# Stop services (keep data)
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f keycloak
docker-compose logs -f postgres

# Restart single service
docker-compose restart keycloak
```

### Frontend Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## 🔐 Keycloak Configuration

### Realm: `orion`
- **Display Name:** Orion Realm
- **Login Theme:** keycloak
- **Session Timeout:** 30 minutes
- **Remember Me:** Enabled
- **Registration:** Disabled (admin-managed)

### Client: `orion-client`
- **Type:** Public Client
- **Protocol:** OpenID Connect
- **Access Type:** public
- **Standard Flow:** Enabled
- **Direct Access Grants:** Enabled
- **Valid Redirect URIs:**
  - `http://localhost:5173/*`
  - `http://localhost:3000/*`
  - `http://localhost:8080/*`

### User Roles
- **admin:** Full system access
- **user:** Standard application access  
- **demo:** Limited demo access

## 🚀 Production Deployment

### Build Frontend Container
```bash
# Build frontend image
docker build -t orion-frontend ./client

# Run with production settings
docker run -p 3000:3000 \
  -e VITE_KEYCLOAK_URL=https://your-keycloak-domain \
  -e VITE_KEYCLOAK_REALM=orion \
  -e VITE_KEYCLOAK_CLIENT_ID=orion-client \
  orion-frontend
```

### Environment Variables for Production
```env
VITE_KEYCLOAK_URL=https://your-keycloak-domain
VITE_KEYCLOAK_REALM=orion
VITE_KEYCLOAK_CLIENT_ID=orion-client
NODE_ENV=production
```

## 🔧 Troubleshooting

### Common Issues

**1. Keycloak not starting**
```bash
# Check Docker status
docker ps

# Check logs
docker-compose logs keycloak

# Restart services
docker-compose restart
```

**2. Database connection issues**
```bash
# Check PostgreSQL
docker-compose exec postgres pg_isready -U keycloak

# Reset database
docker-compose down -v
docker-compose up -d
```

**3. Frontend can't connect to Keycloak**
- Check `.env` file configuration
- Verify Keycloak is running: `http://localhost:8080`
- Check browser console for CORS errors

**4. Authentication fails**
- Verify user exists in Keycloak admin console
- Check realm and client configuration
- Ensure client redirect URIs include your frontend URL

### Health Checks
```bash
# Keycloak health
curl http://localhost:8080/health/ready

# Database health
docker-compose exec postgres pg_isready -U keycloak -d keycloak
```

## 📊 Monitoring

### Service Status
- **Keycloak:** http://localhost:8080/health
- **PostgreSQL:** Check with `pg_isready`
- **Frontend:** Check browser developer tools

### Performance
- **Token Validation:** < 100ms
- **Login Flow:** < 2 seconds
- **Database Queries:** < 50ms

## 🔄 Data Management

### Backup Realm Configuration
```bash
# Export realm
docker-compose exec keycloak /opt/keycloak/bin/kc.sh export \
  --realm orion --file /tmp/orion-realm-backup.json

# Copy to host
docker cp orion-keycloak:/tmp/orion-realm-backup.json ./backup/
```

### Reset to Clean State
```bash
# Stop and remove all data
scripts\stop-keycloak.bat remove-data  # Windows
./scripts/stop-keycloak.sh --remove-data  # Linux/Mac

# Start fresh
scripts\start-keycloak.bat  # Windows  
./scripts/start-keycloak.sh  # Linux/Mac
```

## 📞 Support

### Logs Location
- **Keycloak:** `docker-compose logs keycloak`
- **PostgreSQL:** `docker-compose logs postgres`  
- **Frontend:** Browser developer console

### Configuration Files
- **Docker:** `docker-compose.yml`
- **Keycloak Realm:** `keycloak-import/orion-realm.json`
- **Frontend Config:** `client/src/lib/keycloak.ts`
- **Environment:** `.env`

---

🎉 **You're all set!** The system now supports both real Keycloak authentication and demo accounts for development.
