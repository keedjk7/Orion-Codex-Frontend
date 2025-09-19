#!/bin/bash

# Orion Docker Management Scripts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp env.docker.example .env
        print_success "Created .env file from template"
        print_warning "Please update .env file with your actual configuration"
    else
        print_warning ".env file already exists"
    fi
    
    if [ ! -f .env.dev ]; then
        cp env.docker.dev.example .env.dev
        print_success "Created .env.dev file from template"
    else
        print_warning ".env.dev file already exists"
    fi
}

# Function to start development environment
dev_start() {
    print_status "Starting Orion development environment..."
    check_docker
    setup_env
    
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Keycloak: http://localhost:8080"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
    echo ""
    print_status "To start the Orion app in development mode, run:"
    echo "  npm run dev"
}

# Function to stop development environment
dev_stop() {
    print_status "Stopping Orion development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to start production environment
prod_start() {
    print_status "Starting Orion production environment..."
    check_docker
    setup_env
    
    # Build the application image
    print_status "Building Orion application image..."
    docker-compose build orion-app
    
    # Start all services
    docker-compose up -d
    
    print_success "Production environment started!"
    print_status "Services available at:"
    echo "  - Orion App: http://localhost:5000"
    echo "  - Keycloak: http://localhost:8080"
    echo "  - Nginx (if enabled): http://localhost:80"
}

# Function to stop production environment
prod_stop() {
    print_status "Stopping Orion production environment..."
    docker-compose down
    print_success "Production environment stopped!"
}

# Function to view logs
logs() {
    local service=${1:-}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    fi
}

# Function to reset everything (careful!)
reset() {
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting Orion environment..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose down -v
        docker system prune -f
        print_success "Environment reset complete!"
    else
        print_status "Reset cancelled."
    fi
}

# Function to show status
status() {
    print_status "Orion Docker Environment Status:"
    echo ""
    docker-compose ps
    echo ""
    docker-compose -f docker-compose.dev.yml ps
}

# Function to setup Keycloak
setup_keycloak() {
    print_status "Setting up Keycloak configuration..."
    print_status "Please follow these steps:"
    echo ""
    echo "1. Open http://localhost:8080 in your browser"
    echo "2. Click 'Administration Console'"
    echo "3. Login with admin/admin"
    echo "4. Create a new realm called 'orion'"
    echo "5. Create a client called 'orion-client'"
    echo "6. Configure the client as described in KEYCLOAK_SETUP.md"
    echo ""
    print_status "For detailed instructions, see KEYCLOAK_SETUP.md"
}

# Function to run database migrations
migrate() {
    print_status "Running database migrations..."
    docker-compose exec orion-app npm run db:push
    print_success "Database migrations completed!"
}

# Function to show help
show_help() {
    echo "Orion Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev-start     Start development environment (Keycloak, PostgreSQL, Redis)"
    echo "  dev-stop      Stop development environment"
    echo "  prod-start    Start production environment (all services)"
    echo "  prod-stop     Stop production environment"
    echo "  logs [service] Show logs for all services or specific service"
    echo "  status        Show status of all containers"
    echo "  setup-env     Setup environment files"
    echo "  setup-keycloak Setup Keycloak configuration (interactive)"
    echo "  migrate       Run database migrations"
    echo "  reset         Reset everything (removes all data!)"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev-start"
    echo "  $0 logs orion-app"
    echo "  $0 prod-start"
}

# Main script logic
case "${1:-help}" in
    "dev-start")
        dev_start
        ;;
    "dev-stop")
        dev_stop
        ;;
    "prod-start")
        prod_start
        ;;
    "prod-stop")
        prod_stop
        ;;
    "logs")
        logs "$2"
        ;;
    "status")
        status
        ;;
    "setup-env")
        setup_env
        ;;
    "setup-keycloak")
        setup_keycloak
        ;;
    "migrate")
        migrate
        ;;
    "reset")
        reset
        ;;
    "help"|*)
        show_help
        ;;
esac
