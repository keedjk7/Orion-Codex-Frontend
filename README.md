# 🚀 Orion AI Finance Platform

> **AI-Powered Financial Planning & Analysis (FP&A) Platform**  
> Comprehensive finance team companion with intelligent reporting, scenario modeling, and collaborative planning

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## 🎯 Overview

Orion เป็นแพลตฟอร์ม AI-powered Financial Planning & Analysis (FP&A) ที่ออกแบบมาเพื่อเป็นเพื่อนร่วมงานที่สมบูรณ์แบบสำหรับทีมการเงิน ระบบมีความสามารถในการรายงานทางการเงินอัจฉริยะ, การสร้างแบบจำลองสถานการณ์, ข่าวกรองต้นทุน, การวางแผนร่วมกัน และผู้ช่วย AI สำหรับการสืบค้นด้วยภาษาธรรมชาติ

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ และ npm
- Docker Desktop (สำหรับ containerized deployment)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd OrionCodex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start Development Server
```bash
npm run dev
```

🎉 เปิด [http://localhost:5000](http://localhost:5000) เพื่อดูแอปพลิเคชัน!

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Natural Language Queries**: Ask questions in plain language
- **Automated Insights**: AI-driven financial analysis and recommendations
- **Predictive Analytics**: Forecast trends and identify opportunities
- **Smart Categorization**: Automatic expense and revenue classification

### 📊 Financial Reporting & Analytics
- **Interactive Dashboards**: Real-time financial data visualization
- **Custom Reports**: Build and share tailored financial reports
- **KPI Monitoring**: Track key performance indicators
- **Variance Analysis**: Compare actuals vs. budgets/forecasts

### 🎯 Scenario Modeling
- **What-If Analysis**: Model different business scenarios
- **Sensitivity Analysis**: Understand impact of key variables
- **Monte Carlo Simulations**: Risk assessment and probability modeling
- **Dynamic Forecasting**: Adaptive financial projections

### 💰 Cost Intelligence
- **Cost Allocation**: Intelligent distribution of expenses
- **Profitability Analysis**: Product/service level profitability
- **Budget vs. Actual**: Detailed variance tracking
- **Spend Analytics**: Vendor and category spend analysis

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library built on Radix UI
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Recharts** for data visualization

### Backend Stack
- **Node.js** with Express.js framework
- **TypeScript** for full-stack type safety
- **PostgreSQL** with Drizzle ORM
- **Redis** for session management
- **Keycloak** for authentication and authorization

## 🐳 Docker Deployment

### Development Environment
Run supporting services (PostgreSQL, Keycloak, Redis) in containers:

```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Run Orion app locally
npm install
npm run dev
```

### Production Environment
Run everything in containers:

```bash
# Build and start all services
docker-compose up -d --build
```

### Docker Management Script

```bash
# Make script executable (Linux/Mac)
chmod +x docker-scripts.sh

# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Available Commands:**
```bash
./docker-scripts.sh dev-start     # Start development environment
./docker-scripts.sh dev-stop      # Stop development environment
./docker-scripts.sh prod-start    # Start production environment
./docker-scripts.sh prod-stop     # Stop production environment
./docker-scripts.sh logs [service] # View service logs
./docker-scripts.sh status        # Check container status
./docker-scripts.sh reset         # Reset everything (⚠️ deletes data!)
```

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Orion App | 5000 | Main application |
| Keycloak | 8080 | Authentication server |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Session storage |
| Nginx | 80/443 | Reverse proxy (optional) |

## 🔐 Authentication Setup

### Keycloak Configuration

1. **Start Keycloak**: `docker-compose -f docker-compose.dev.yml up -d keycloak`
2. **Access Admin Console**: http://localhost:8080
3. **Login**: admin/admin
4. **Create Realm**: "orion"
5. **Create Client**: "orion-client"

### Client Settings
```yaml
Client ID: orion-client
Client authentication: OFF (Public client)
Standard flow: ON
Direct access grants: ON
Valid redirect URIs: http://localhost:5000/*
Web origins: http://localhost:5000
```

### Create Test User
```yaml
Username: testuser
Email: test@orion.com
Password: password123
Email verified: ON
```

📖 **Detailed Setup**: See `KEYCLOAK_SETUP.md` for complete instructions

## 📁 Project Structure

```
OrionCodex/
├── 📁 client/                    # Frontend React application
│   ├── 📁 public/               # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── 📁 ui/          # shadcn/ui components
│   │   │   └── ...
│   │   ├── 📁 contexts/         # React contexts
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 lib/              # Utility libraries
│   │   ├── 📁 pages/            # Page components
│   │   └── main.tsx
│   └── index.html
├── 📁 server/                    # Backend Express application
│   ├── index.ts                 # Main server file
│   ├── routes.ts               # API routes
│   ├── storage.ts              # Data access layer
│   └── ...
├── 📁 shared/                    # Shared TypeScript definitions
│   └── schema.ts               # Database schema
├── 🐳 docker-compose.yml       # Production Docker setup
├── 🐳 docker-compose.dev.yml   # Development Docker setup
├── 🐳 Dockerfile              # Application container
├── ⚙️ drizzle.config.ts       # Database configuration
├── ⚙️ vite.config.ts          # Vite configuration
├── ⚙️ tailwind.config.ts      # Tailwind CSS configuration
├── 📄 package.json            # Dependencies and scripts
└── 📖 README.md               # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio

# Server
npm run server:dev   # Start development server
npm run server:prod  # Start production server
```

## 🔧 Configuration

### Environment Variables

```env
# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=orion
VITE_KEYCLOAK_CLIENT_ID=orion-client

# Application Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://orion:password@localhost:5432/orion_db

# Redis
REDIS_URL=redis://localhost:6379

# Session
SESSION_SECRET=your-super-secret-session-key
```

## 🚨 Troubleshooting

### Common Issues

#### 🔌 Port Conflicts
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

#### 🐳 Docker Issues
```bash
# Reset Docker environment
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

#### 🔐 Keycloak Connection Issues
```bash
# Check Keycloak logs
docker-compose logs keycloak

# Verify Keycloak is accessible
curl http://localhost:8080/realms/orion/.well-known/openid_configuration
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting on save
- **Conventional Commits**: Use semantic commit messages

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component library
- **Tailwind CSS** for the utility-first CSS framework
- **Drizzle ORM** for type-safe database operations
- **TanStack Query** for powerful data fetching
- **Keycloak** for robust authentication

---

<div align="center">
  <p><strong>Made with ❤️ by the Orion Team</strong></p>
</div>
