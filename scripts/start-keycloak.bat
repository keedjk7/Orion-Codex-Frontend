@echo off
REM Script to start Keycloak with Docker Compose
REM Usage: scripts\start-keycloak.bat

echo 🚀 Starting Orion Keycloak Services...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Create .env file from example if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from example...
    copy env.example .env >nul
    echo ✅ .env file created. You can modify it if needed.
)

REM Start services
echo 🐳 Starting Docker Compose services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready...

REM Wait for PostgreSQL
echo 📊 Waiting for PostgreSQL...
:wait_postgres
docker-compose exec postgres pg_isready -U keycloak -d keycloak >nul 2>&1
if errorlevel 1 (
    echo    PostgreSQL is not ready yet...
    timeout /t 2 >nul
    goto wait_postgres
)
echo ✅ PostgreSQL is ready!

REM Wait for Keycloak
echo 🔐 Waiting for Keycloak...
:wait_keycloak
curl -f http://localhost:8080/health/ready >nul 2>&1
if errorlevel 1 (
    echo    Keycloak is not ready yet...
    timeout /t 5 >nul
    goto wait_keycloak
)
echo ✅ Keycloak is ready!

echo.
echo 🎉 All services are running!
echo.
echo 📋 Service Information:
echo    🔐 Keycloak Admin: http://localhost:8080
echo       Username: admin
echo       Password: admin123
echo.
echo    📊 PostgreSQL: localhost:5432
echo       Database: keycloak
echo       Username: keycloak
echo       Password: keycloak123
echo.
echo    🌐 Frontend: http://localhost:3000 (if built with Docker)
echo    🌐 Dev Frontend: http://localhost:5173 (npm run dev)
echo.
echo 🔑 Test Accounts:
echo    admin / admin123
echo    testuser / test123
echo    demo / demo123
echo.
echo 📝 To stop services: docker-compose down
echo 🗑️  To remove volumes: docker-compose down -v

pause
