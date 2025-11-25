#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  Project Initialization Script
#  Usage: ./initialize.sh [--skip-db]
# ═══════════════════════════════════════════════════════════════

# Change to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

# Parse command line arguments
SKIP_DATABASE=false

for arg in "$@"; do
    case $arg in
        --skip-db)
            SKIP_DATABASE=true
            shift
            ;;
        *)
            echo "Unknown option: $arg"
            echo "Usage: $0 [--skip-db]"
            exit 1
            ;;
    esac
done

# Configuration
MIGRATIONS_DIR="drizzle"
DB_WAIT_TIMEOUT=30

# Calculate total steps based on options
if [ "$SKIP_DATABASE" = true ]; then
    TOTAL_STEPS=4
else
    TOTAL_STEPS=7
fi

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
    clear
    echo ""
    echo -e "${C_BOLD}${C_PRIMARY}  ╭──────────────────────────────────────────────────────────╮${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │                                                          │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │           ${C_RESET}${C_BOLD}Next.js Project Setup Installer${C_RESET}${C_BOLD}${C_PRIMARY}                │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │                                                          │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  ╰──────────────────────────────────────────────────────────╯${C_RESET}"
    echo ""
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
    echo -e "  ${C_SUCCESS}${S_ROCKET}  ${C_BOLD}${C_SUCCESS}Setup completed successfully!${C_RESET}"
    echo ""
    echo -e "  ${C_BOLD}Next steps:${C_RESET}"
    echo -e "    ${C_PRIMARY}1.${C_RESET} Review your ${C_BOLD}.env${C_RESET} file and adjust settings"
    echo -e "    ${C_PRIMARY}2.${C_RESET} Run ${C_BOLD}${C_SUCCESS}pnpm run dev${C_RESET} to start development server"
    echo ""
    echo -e "${C_MUTED}  ────────────────────────────────────────────────────────────${C_RESET}"
    echo ""
}

# ───────────────────────────────────────────────────────────────
# Helper Functions
# ───────────────────────────────────────────────────────────────

# Executes a command with proper error handling
execute_silent() {
    local cmd="$1"
    local error_msg="${2:-Command failed}"
    local output
    local exit_code

    output=$(eval "$cmd" 2>&1)
    exit_code=$?

    if [ $exit_code -ne 0 ]; then
        print_error "$error_msg"
        if [ -n "$output" ]; then
            echo -e "    ${C_DIM}${output}${C_RESET}" >&2
        fi
        return 1
    fi
    return 0
}

# Checks if docker compose is available
check_docker_compose() {
    if ! docker compose version > /dev/null 2>&1; then
        print_error "Docker Compose is not installed or not available"
        exit 1
    fi
}

# Waits for database with visual feedback
wait_for_database() {
    local timeout=$1

    print_action "Waiting for database to be ready..."
    echo -ne "    ${C_DIM}   "

    for ((i=1; i<=timeout; i++)); do
        if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
            echo -e "${C_RESET}"
            return 0
        fi
        echo -ne "."
        sleep 1
    done

    echo -e "${C_RESET}"
    return 1
}

# Handles errors and exits gracefully
handle_error() {
    local step=$1
    local message=$2

    echo ""
    print_error "$message"
    echo ""
    echo -e "  ${C_MUTED}Setup failed at step ${step}/${TOTAL_STEPS}${C_RESET}"
    echo ""
    exit 1
}

# ───────────────────────────────────────────────────────────────
# Installation Steps
# ───────────────────────────────────────────────────────────────

step_install_packages() {
    print_step 1 "Installing NPM Packages"

    print_action "Running pnpm install..."

    if execute_silent "pnpm install"; then
        print_success "Dependencies installed successfully"
    else
        handle_error 1 "Failed to install NPM packages"
    fi
}

step_setup_env() {
    print_step 2 "Environment Configuration"

    if [ -f .env ]; then
        print_warning ".env file already exists"
        print_info "Keeping existing configuration"
    else
        print_action "Creating .env from template..."
        if cp .env.sample .env; then
            print_success "Environment file created"
        else
            handle_error 2 "Failed to create .env file"
        fi
    fi
}

step_generate_secret() {
    print_step 3 "Authentication Secret"

    if grep -q "^BETTER_AUTH_SECRET=.\+" .env; then
        print_warning "Secret already configured"
        print_info "Skipping generation"
    else
        print_action "Generating secure random secret..."

        local secret
        secret=$(openssl rand -base64 32 | tr -d "=/+")

        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$secret|" .env
        else
            sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$secret|" .env
        fi

        print_success "Authentication secret generated"
    fi
}

step_start_database() {
    print_step 4 "Database Container"

    check_docker_compose

    print_action "Stopping existing containers..."
    docker compose down > /dev/null 2>&1 || true

    print_action "Starting PostgreSQL database..."
    local output
    local exit_code

    output=$(docker compose up -d postgres 2>&1)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_success "Database container started"
    else
        print_error "Failed to start database container"
        echo ""
        echo -e "    ${C_DIM}Error details:${C_RESET}"
        echo -e "    ${C_DIM}${output}${C_RESET}"
        echo ""
        handle_error 4 "Docker compose command failed with exit code $exit_code"
    fi

    if wait_for_database "$DB_WAIT_TIMEOUT"; then
        print_success "Database is ready"
    else
        handle_error 4 "Database failed to start within ${DB_WAIT_TIMEOUT}s"
    fi
}

step_check_migrations() {
    print_step 5 "Database Migrations"

    local sql_files
    sql_files=$(find "${MIGRATIONS_DIR}" -maxdepth 1 -name "*.sql" -type f 2>/dev/null)

    if [ -n "$sql_files" ]; then
        local count
        count=$(echo "$sql_files" | wc -l)
        print_success "Found ${count} existing migration(s)"
    else
        print_warning "No migrations found"
        print_action "Generating initial migration..."

        if execute_silent "pnpm run db:generate"; then
            print_success "Initial migration generated"
        else
            handle_error 5 "Failed to generate migration"
        fi
    fi
}

step_apply_migrations() {
    print_step 6 "Database Schema"

    print_action "Applying migrations to database..."

    if execute_silent "pnpm run db:migrate"; then
        print_success "Database schema initialized"
    else
        handle_error 6 "Failed to apply migrations"
    fi
}

step_finalize() {
    local step_num
    if [ "$SKIP_DATABASE" = true ]; then
        step_num=4
    else
        step_num=7
    fi

    print_step "$step_num" "Finalization"

    print_success "All components configured"
    if [ "$SKIP_DATABASE" = true ]; then
        print_info "Database setup was skipped (use without --skip-db to set up database)"
    fi
    print_success "Project ready for development"
}

# ───────────────────────────────────────────────────────────────
# Main Execution
# ───────────────────────────────────────────────────────────────

main() {
    print_header

    # Always run these steps
    step_install_packages
    step_setup_env
    step_generate_secret

    # Conditionally run database steps
    if [ "$SKIP_DATABASE" = false ]; then
        step_start_database
        step_check_migrations
        step_apply_migrations
    fi

    # Finalize
    step_finalize

    print_footer
}

# Run main function
main