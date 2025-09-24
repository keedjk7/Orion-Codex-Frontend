@echo off
REM Script to stop Keycloak Docker Compose services
REM Usage: scripts\stop-keycloak.bat [remove-data]

echo 🛑 Stopping Orion Keycloak Services...

if "%1"=="remove-data" (
    echo ⚠️  This will remove all data including users and configuration!
    set /p "confirm=Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        echo 🗑️  Stopping services and removing volumes...
        docker-compose down -v
        echo ✅ Services stopped and data removed!
    ) else (
        echo ❌ Operation cancelled.
        exit /b 0
    )
) else (
    echo 🛑 Stopping services (keeping data)...
    docker-compose down
    echo ✅ Services stopped!
    echo 📝 Data is preserved. Use 'docker-compose up -d' to restart.
)

echo.
echo 💡 Available options:
echo    scripts\stop-keycloak.bat           - Stop services, keep data
echo    scripts\stop-keycloak.bat remove-data - Stop services and remove all data

pause
