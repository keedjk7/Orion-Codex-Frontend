#!/bin/bash

# Script to stop Keycloak Docker Compose services
# Usage: ./scripts/stop-keycloak.sh [--remove-data]

set -e

echo "🛑 Stopping Orion Keycloak Services..."

if [ "$1" = "--remove-data" ]; then
    echo "⚠️  This will remove all data including users and configuration!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Stopping services and removing volumes..."
        docker-compose down -v
        echo "✅ Services stopped and data removed!"
    else
        echo "❌ Operation cancelled."
        exit 0
    fi
else
    echo "🛑 Stopping services (keeping data)..."
    docker-compose down
    echo "✅ Services stopped!"
    echo "📝 Data is preserved. Use 'docker-compose up -d' to restart."
fi

echo ""
echo "💡 Available options:"
echo "   ./scripts/stop-keycloak.sh           - Stop services, keep data"
echo "   ./scripts/stop-keycloak.sh --remove-data - Stop services and remove all data"
