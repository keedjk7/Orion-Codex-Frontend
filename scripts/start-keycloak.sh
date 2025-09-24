#!/bin/bash

# Script to start Keycloak with Docker Compose
# Usage: ./scripts/start-keycloak.sh

set -e

echo "🚀 Starting Orion Keycloak Services..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "✅ .env file created. You can modify it if needed."
fi

# Start services
echo "🐳 Starting Docker Compose services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
echo "📊 Waiting for PostgreSQL..."
until docker-compose exec postgres pg_isready -U keycloak -d keycloak >/dev/null 2>&1; do
    echo "   PostgreSQL is not ready yet..."
    sleep 2
done
echo "✅ PostgreSQL is ready!"

# Wait for Keycloak
echo "🔐 Waiting for Keycloak..."
until curl -f http://localhost:8080/health/ready >/dev/null 2>&1; do
    echo "   Keycloak is not ready yet..."
    sleep 5
done
echo "✅ Keycloak is ready!"

echo ""
echo "🎉 All services are running!"
echo ""
echo "📋 Service Information:"
echo "   🔐 Keycloak Admin: http://localhost:8080"
echo "      Username: admin"
echo "      Password: admin123"
echo ""
echo "   📊 PostgreSQL: localhost:5432"
echo "      Database: keycloak"
echo "      Username: keycloak"
echo "      Password: keycloak123"
echo ""
echo "   🌐 Frontend: http://localhost:3000 (if built with Docker)"
echo "   🌐 Dev Frontend: http://localhost:5173 (npm run dev)"
echo ""
echo "🔑 Test Accounts:"
echo "   admin / admin123"
echo "   testuser / test123"
echo "   demo / demo123"
echo ""
echo "📝 To stop services: docker-compose down"
echo "🗑️  To remove volumes: docker-compose down -v"
