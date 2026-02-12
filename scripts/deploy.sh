#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  Production Deployment Script
#  Usage: ./deploy.sh [--profile <internal|ssl>] [--rebuild] [--init]
#                     [--remote] [--image <url>]
# ═══════════════════════════════════════════════════════════════

# Change to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

# Parse command line arguments
PROFILE=""
REBUILD=false
FORCE_INIT=false
REMOTE=false
DOCKER_IMAGE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        --init)
            FORCE_INIT=true
            shift
            ;;
        --remote)
            REMOTE=true
            shift
            ;;
        --image)
            DOCKER_IMAGE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--profile <internal|ssl>] [--rebuild] [--init]"
            echo "       $0 --remote --image <url> --profile <internal|ssl>"
            exit 1
            ;;
    esac
done

# Configuration
TOTAL_STEPS=5

# ───────────────────────────────────────────────────────────────
# Colors & Symbols
# ───────────────────────────────────────────────────────────────

# Colors
readonly C_RESET='\033[0m'
readonly C_BOLD='\033[1m'
readonly C_DIM='\033[2m'

readonly C_PRIMARY='\033[38;5;75m'      # Soft blue
readonly C_SUCCESS='\033[38;5;114m'     # Soft green
readonly C_WARNING='\033[38;5;221m'     # Soft yellow
readonly C_ERROR='\033[38;5;204m'       # Soft red
readonly C_INFO='\033[38;5;147m'        # Light purple
readonly C_MUTED='\033[38;5;245m'       # Gray

# Symbols
readonly S_SUCCESS="✓"
readonly S_ERROR="✗"
readonly S_WARN="!"
readonly S_INFO="→"
readonly S_WORKING="●"
readonly S_ROCKET="🚀"

# ───────────────────────────────────────────────────────────────
# Output Functions
# ───────────────────────────────────────────────────────────────

print_header() {
    if [ "$REMOTE" != true ]; then
        clear
    fi
    echo ""
    echo -e "${C_BOLD}${C_PRIMARY}  ╭──────────────────────────────────────────────────────────╮${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │                                                          │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │        ${C_RESET}${C_BOLD}Production Deployment Manager${C_RESET}${C_BOLD}${C_PRIMARY}                      │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │                                                          │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  ╰──────────────────────────────────────────────────────────╯${C_RESET}"
    echo ""
    if [ "$REMOTE" = true ]; then
        echo -e "  ${C_INFO}Mode: ${C_BOLD}Remote Deploy${C_RESET} ${C_DIM}(pull from registry)${C_RESET}"
        echo ""
    fi
}

print_step() {
    local step=$1
    local title=$2
    local progress=$((step * 100 / TOTAL_STEPS))

    echo ""
    echo -e "${C_MUTED}  ────────────────────────────────────────────────────────────${C_RESET}"
    echo ""
    echo -e "  ${C_BOLD}${C_PRIMARY}Step ${step}/${TOTAL_STEPS}${C_RESET}  ${C_BOLD}${title}${C_RESET}"
    echo -e "  ${C_DIM}Progress: ${progress}%${C_RESET}"
    echo ""
}

print_action() {
    echo -e "    ${C_INFO}${S_WORKING}${C_RESET}  ${C_DIM}$1${C_RESET}"
}

print_success() {
    echo -e "    ${C_SUCCESS}${S_SUCCESS}${C_RESET}  $1"
}

print_error() {
    echo -e "    ${C_ERROR}${S_ERROR}${C_RESET}  ${C_BOLD}$1${C_RESET}" >&2
}

print_warning() {
    echo -e "    ${C_WARNING}${S_WARN}${C_RESET}  $1"
}

print_info() {
    echo -e "    ${C_INFO}${S_INFO}${C_RESET}  $1"
}

print_footer() {
    echo ""
    echo -e "${C_MUTED}  ────────────────────────────────────────────────────────────${C_RESET}"
    echo ""
    echo -e "  ${C_SUCCESS}${S_ROCKET}  ${C_BOLD}${C_SUCCESS}Deployment completed successfully!${C_RESET}"
    echo ""
    echo -e "  ${C_BOLD}Your application is now running in production mode${C_RESET}"
    echo ""
    echo -e "${C_MUTED}  ────────────────────────────────────────────────────────────${C_RESET}"
    echo ""
}

# ───────────────────────────────────────────────────────────────
# Helper Functions
# ───────────────────────────────────────────────────────────────

# Handles errors and exits gracefully
handle_error() {
    local step=$1
    local message=$2

    echo ""
    print_error "$message"
    echo ""
    echo -e "  ${C_MUTED}Deployment failed at step ${step}/${TOTAL_STEPS}${C_RESET}"
    echo ""
    exit 1
}

# Checks if docker compose is available
check_docker_compose() {
    if ! docker compose version > /dev/null 2>&1; then
        print_error "Docker Compose is not installed or not available"
        exit 1
    fi
}

# Checks if project is already initialized
is_project_initialized() {
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        return 1
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        return 1
    fi

    # Check if BETTER_AUTH_SECRET is set in .env
    if ! grep -q "^BETTER_AUTH_SECRET=.\+" .env; then
        return 1
    fi

    return 0
}

# Prompts user to select profile
select_profile() {
    echo ""
    echo -e "  ${C_BOLD}${C_PRIMARY}Select NGINX profile:${C_RESET}"
    echo ""
    echo -e "    ${C_PRIMARY}1)${C_RESET} ${C_BOLD}internal${C_RESET} - HTTP only"
    echo -e "       ${C_DIM}When a reverse proxy handles SSL (Traefik, Caddy, etc.)${C_RESET}"
    echo ""
    echo -e "    ${C_PRIMARY}2)${C_RESET} ${C_BOLD}ssl${C_RESET}      - HTTPS with SSL certificates (ports 80, 443)"
    echo -e "       ${C_DIM}When NGINX directly manages SSL without a reverse proxy${C_RESET}"
    echo ""
    echo -ne "  ${C_BOLD}Enter your choice [1-2]:${C_RESET} "

    local choice
    read -r choice

    case $choice in
        1)
            PROFILE="internal"
            ;;
        2)
            PROFILE="ssl"
            ;;
        *)
            echo ""
            print_error "Invalid choice. Please select 1 or 2."
            select_profile
            ;;
    esac
}

# Validates that SSL config has no unresolved placeholders
validate_ssl_domain() {
    local ssl_conf="nginx/nginx.ssl.conf"

    if [ ! -f "$ssl_conf" ]; then
        handle_error 4 "nginx.ssl.conf not found"
    fi

    if grep -q "{{DOMAIN}}" "$ssl_conf"; then
        echo ""
        print_error "nginx/nginx.ssl.conf contains unresolved {{DOMAIN}} placeholders"
        echo ""
        echo -e "    ${C_DIM}Please replace all {{DOMAIN}} occurrences in nginx/nginx.ssl.conf${C_RESET}"
        echo -e "    ${C_DIM}with your actual domain before deploying.${C_RESET}"
        echo ""
        echo -e "    ${C_DIM}Example: sed -i 's|{{DOMAIN}}|example.com|g' nginx/nginx.ssl.conf${C_RESET}"
        echo ""
        exit 1
    fi

    local configured_domain
    configured_domain=$(grep -m1 "server_name" "$ssl_conf" | sed 's/.*server_name \([^ ]*\).*/\1/')
    print_success "SSL domain configured: ${configured_domain}"
}

# ───────────────────────────────────────────────────────────────
# Deployment Steps
# ───────────────────────────────────────────────────────────────

step_verify_requirements() {
    print_step 1 "Verifying Requirements"

    check_docker_compose
    print_success "Docker Compose is available"

    if [ "$REMOTE" = true ]; then
        # Remote mode: only need compose file and .env
        if [ ! -f "docker-compose.prod.yml" ]; then
            handle_error 1 "docker-compose.prod.yml not found"
        fi
        print_success "Production compose file found"

        if [ ! -f ".env" ]; then
            handle_error 1 ".env file not found (create it with required secrets)"
        fi
        print_success "Environment file found"

        if [ -z "$DOCKER_IMAGE" ]; then
            handle_error 1 "--image is required in remote mode"
        fi
        print_success "Docker image: ${DOCKER_IMAGE}"
    else
        # Local mode: need initialize.sh and compose file
        if [ ! -f "scripts/initialize.sh" ]; then
            handle_error 1 "scripts/initialize.sh not found"
        fi
        print_success "Initialize script found"

        if [ ! -f "docker-compose.prod.yml" ]; then
            handle_error 1 "docker-compose.prod.yml not found"
        fi
        print_success "Production compose file found"
    fi
}

step_initialize_project() {
    print_step 2 "Initializing Project"

    if [ "$REMOTE" = true ]; then
        print_success "Skipped (remote mode — no local build needed)"
        return 0
    fi

    # Check if initialization is needed
    if [ "$FORCE_INIT" = false ] && is_project_initialized; then
        print_success "Project already initialized"
        print_info "Skipping initialization (use --init to force)"
        return 0
    fi

    if [ "$FORCE_INIT" = true ]; then
        print_warning "Forcing reinitialization"
    fi

    print_action "Running initialization with --skip-db..."

    if bash scripts/initialize.sh --skip-db; then
        print_success "Project initialized successfully"
    else
        handle_error 2 "Failed to initialize project"
    fi
}

step_configure_database() {
    print_step 3 "Configuring Database Connection"

    if [ "$REMOTE" = true ]; then
        print_success "Skipped (remote mode — .env is pre-configured on server)"
        return 0
    fi

    if [ ! -f ".env" ]; then
        handle_error 3 ".env file not found. Initialization may have failed."
    fi

    print_action "Updating POSTGRES_HOST to container name..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^POSTGRES_HOST=.*|POSTGRES_HOST=postgres|" .env
    else
        sed -i "s|^POSTGRES_HOST=.*|POSTGRES_HOST=postgres|" .env
    fi

    if grep -q "^POSTGRES_HOST=postgres" .env; then
        print_success "Database host configured for Docker network"
    else
        handle_error 3 "Failed to update POSTGRES_HOST in .env"
    fi
}

step_select_profile() {
    print_step 4 "NGINX Profile Selection"

    if [ -z "$PROFILE" ]; then
        if [ "$REMOTE" = true ]; then
            handle_error 4 "--profile is required in remote mode"
        fi
        select_profile
    fi

    # Validate profile
    if [[ "$PROFILE" != "internal" && "$PROFILE" != "ssl" ]]; then
        handle_error 4 "Invalid profile: $PROFILE. Must be 'internal' or 'ssl'."
    fi

    print_success "Selected profile: ${C_BOLD}${PROFILE}${C_RESET}"

    # If SSL profile, validate that domain placeholders are resolved
    if [ "$PROFILE" = "ssl" ]; then
        validate_ssl_domain
    fi
}

step_start_production() {
    print_step 5 "Starting Production Containers"

    local compose_cmd="docker compose -f docker-compose.prod.yml --profile $PROFILE"

    if [ "$REMOTE" = true ]; then
        # Remote mode: export image, pull, then start
        export DOCKER_IMAGE
        print_action "Pulling image: ${DOCKER_IMAGE}..."
        echo ""

        if ! ${compose_cmd} pull nextjs; then
            echo ""
            handle_error 5 "Failed to pull image: ${DOCKER_IMAGE}"
        fi

        echo ""
        print_success "Image pulled successfully"
        print_action "Stopping existing containers..."
        ${compose_cmd} down 2>/dev/null
        print_action "Starting containers with profile: ${PROFILE}..."
        echo ""

        if ${compose_cmd} up -d; then
            echo ""
            print_success "All containers started successfully"
            print_info "Profile: ${PROFILE}"
            print_info "Image: ${DOCKER_IMAGE}"
        else
            echo ""
            handle_error 5 "Docker compose command failed"
        fi
    else
        # Local mode: build and start
        if [ "$REBUILD" = true ]; then
            print_action "Building and starting containers with profile: ${PROFILE}..."
            print_info "Rebuild forced - building from scratch"
        else
            print_action "Starting containers with profile: ${PROFILE}..."
            print_info "Using existing images (use --rebuild to force rebuild)"
        fi
        echo ""

        local up_cmd="${compose_cmd} up -d"
        if [ "$REBUILD" = true ]; then
            up_cmd="${up_cmd} --build"
        fi

        if eval "$up_cmd"; then
            echo ""
            print_success "All containers started successfully"
            print_info "Profile: ${PROFILE}"
        else
            echo ""
            print_error "Failed to start production containers"
            handle_error 5 "Docker compose command failed"
        fi
    fi

    # Show running containers
    echo ""
    print_action "Running containers:"
    docker compose -f docker-compose.prod.yml --profile "$PROFILE" ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | while IFS= read -r line; do
        echo -e "    ${C_DIM}${line}${C_RESET}"
    done
}

# ───────────────────────────────────────────────────────────────
# Main Execution
# ───────────────────────────────────────────────────────────────

main() {
    print_header

    step_verify_requirements
    step_initialize_project
    step_configure_database
    step_select_profile
    step_start_production

    print_footer
}

# Run main function
main
