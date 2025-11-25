#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  Production Stop Script
#  Usage: ./stop.sh [--profile <internal|ssl>]
# ═══════════════════════════════════════════════════════════════

# Change to project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

# Parse command line arguments
PROFILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--profile <internal|ssl>]"
            exit 1
            ;;
    esac
done

# Configuration
TOTAL_STEPS=2

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
readonly S_STOP="■"

# ───────────────────────────────────────────────────────────────
# Output Functions
# ───────────────────────────────────────────────────────────────

print_header() {
    clear
    echo ""
    echo -e "${C_BOLD}${C_PRIMARY}  ╭──────────────────────────────────────────────────────────╮${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │                                                          │${C_RESET}"
    echo -e "${C_BOLD}${C_PRIMARY}  │           ${C_RESET}${C_BOLD}Production Stop Manager${C_RESET}${C_BOLD}${C_PRIMARY}                        │${C_RESET}"
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
    echo -e "  ${C_WARNING}${S_STOP}  ${C_BOLD}${C_WARNING}All containers stopped successfully!${C_RESET}"
    echo ""
    echo -e "  ${C_DIM}Use ${C_BOLD}./deploy.sh${C_RESET}${C_DIM} to start them again${C_RESET}"
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
    echo -e "  ${C_MUTED}Stop failed at step ${step}/${TOTAL_STEPS}${C_RESET}"
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

# Prompts user to select profile
select_profile() {
    echo ""
    echo -e "  ${C_BOLD}${C_PRIMARY}Select NGINX profile to stop:${C_RESET}"
    echo ""
    echo -e "    ${C_PRIMARY}1)${C_RESET} ${C_BOLD}internal${C_RESET} - Stop internal profile containers"
    echo -e "       ${C_DIM}Stops nginx-internal, nextjs, postgres${C_RESET}"
    echo ""
    echo -e "    ${C_PRIMARY}2)${C_RESET} ${C_BOLD}ssl${C_RESET}      - Stop ssl profile containers"
    echo -e "       ${C_DIM}Stops nginx-ssl, nextjs, postgres${C_RESET}"
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

# ───────────────────────────────────────────────────────────────
# Stop Steps
# ───────────────────────────────────────────────────────────────

step_select_profile() {
    print_step 1 "Profile Selection"

    if [ -z "$PROFILE" ]; then
        select_profile
    fi

    # Validate profile
    if [[ "$PROFILE" != "internal" && "$PROFILE" != "ssl" ]]; then
        handle_error 1 "Invalid profile: $PROFILE. Must be 'internal' or 'ssl'."
    fi

    print_success "Selected profile: ${C_BOLD}${PROFILE}${C_RESET}"
}

step_stop_containers() {
    print_step 2 "Stopping Containers"

    check_docker_compose

    print_action "Stopping all containers for profile: ${PROFILE}..."
    echo ""

    # Run docker compose down with live output
    if docker compose -f docker-compose.prod.yml --profile "$PROFILE" down; then
        echo ""
        print_success "All containers stopped and removed"
        print_info "Profile: ${PROFILE}"
    else
        echo ""
        print_error "Failed to stop containers"
        handle_error 2 "Docker compose down command failed"
    fi
}

# ───────────────────────────────────────────────────────────────
# Main Execution
# ───────────────────────────────────────────────────────────────

main() {
    print_header

    step_select_profile
    step_stop_containers

    print_footer
}

# Run main function
main