#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Unicode symbols
CHECK="✓"
CROSS="✗"
ARROW="→"
ROCKET="🚀"

# Functions
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║                   PROJECT SETUP INSTALLER                     ║${NC}"
    echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo ""
    echo -e "${BOLD}${BLUE}[$1/6]${NC} ${BOLD}$2${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK}${NC} $1"
}

print_error() {
    echo -e "${RED}${CROSS}${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}${ARROW}${NC} $1"
}

print_footer() {
    echo ""
    echo -e "${BOLD}${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║               ${ROCKET} INSTALLATION COMPLETE! ${ROCKET}                   ║${NC}"
    echo -e "${BOLD}${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Next step:${NC}"
    echo -e "  ${BLUE}${ARROW}${NC} Run ${BOLD}${GREEN}pnpm run dev${NC} to start the development server"
    echo ""
}

# Start installation
clear
print_header

# 1. Install NPM packages
print_step "1" "Installing NPM packages"
echo -e "${BLUE}${ARROW}${NC} Running pnpm install..."
if pnpm install > /dev/null 2>&1; then
    print_success "NPM packages installed successfully"
else
    print_error "Failed to install NPM packages"
    exit 1
fi

# 2. Create .env file
print_step "2" "Setting up environment configuration"
if [ -f .env ]; then
    print_warning ".env file already exists, skipping creation"
else
    cp .env.sample .env
    print_success "Created .env file from template"
fi

# 3. Generate BETTER_AUTH_SECRET
print_step "3" "Generating authentication secret"
if grep -q "^BETTER_AUTH_SECRET=.\+" .env; then
    print_warning "BETTER_AUTH_SECRET already configured, skipping"
else
    echo -e "${BLUE}${ARROW}${NC} Generating secure random secret..."
    SECRET=$(openssl rand -base64 32 | tr -d "=/+")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$SECRET|" .env
    else
        sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$SECRET|" .env
    fi
    print_success "Authentication secret generated"
fi

# 4. Start Docker database
print_step "4" "Starting Docker database container"
echo -e "${BLUE}${ARROW}${NC} Cleaning up existing containers..."
docker-compose down > /dev/null 2>&1

echo -e "${BLUE}${ARROW}${NC} Starting PostgreSQL database..."
if docker-compose up -d database > /dev/null 2>&1; then
    print_success "Database container started"
else
    print_error "Failed to start database container"
    echo -e "${YELLOW}${ARROW}${NC} Trying alternative command..."
    if docker compose up -d database > /dev/null 2>&1; then
        print_success "Database container started (using docker compose)"
    else
        print_error "Docker Compose not properly installed"
        exit 1
    fi
fi

# Wait for database
echo -e "${BLUE}${ARROW}${NC} Waiting for database to be ready"
echo -n "   "
for i in {1..30}; do
    if docker-compose exec -T database pg_isready -U postgres >/dev/null 2>&1 || \
       docker compose exec -T database pg_isready -U postgres >/dev/null 2>&1; then
        echo ""
        print_success "Database is ready and accepting connections"
        break
    fi
    echo -n "."
    sleep 1
done

if [ $i -eq 30 ]; then
    echo ""
    print_error "Database failed to start within 30 seconds"
    exit 1
fi

# 5. Push database schema
print_step "5" "Initializing database schema"
echo -e "${BLUE}${ARROW}${NC} Generating database schema..."
if pnpm run db:generate > /dev/null 2>&1; then
    print_success "Database schema generated successfully"
else
    print_error "Failed to generate database schema"
    exit 1
fi

# 6. Push database schema
echo -e "${BLUE}${ARROW}${NC} pushing schema to database..."
if pnpm run db:push > /dev/null 2>&1; then
    print_success "Database schema pushed successfully"
else
    print_error "Failed to push schema to database"
    exit 1
fi

# 6. Final step
print_step "6" "Finalizing setup"
print_success "All components installed and configured"

# Show completion
print_footer