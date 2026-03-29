#!/bin/bash

# PolyNotice Landing Page Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "======================================"
echo "  PolyNotice Landing Page Setup"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running from correct directory
if [ ! -f "landing.html" ]; then
  print_error "Please run this script from the polynotice-landingpage directory"
  exit 1
fi

# Step 1: Check prerequisites
echo "Checking prerequisites..."

# Check PHP
if ! command -v php &> /dev/null; then
  print_error "PHP is not installed"
  exit 1
fi
PHP_VERSION=$(php -v | head -n 1)
print_success "PHP found: $PHP_VERSION"

# Check MySQL
if ! command -v mysql &> /dev/null; then
  print_warning "MySQL CLI not found (you can still use phpMyAdmin)"
else
  print_success "MySQL found"
fi

# Step 2: Setup .env file
echo ""
echo "Setting up environment configuration..."

if [ -f ".env" ]; then
  print_warning ".env file already exists"
  read -p "Do you want to overwrite it? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Skipping .env setup"
  else
    cp .env.example .env
    print_success ".env file created"
  fi
else
  cp .env.example .env
  print_success ".env file created from template"
fi

# Step 3: Database setup
echo ""
echo "Database Setup Instructions:"
echo "======================================"
echo ""
echo "Option 1: Using MySQL CLI"
echo "  mysql -u root -p < schema.sql"
echo ""
echo "Option 2: Using phpMyAdmin"
echo "  1. Login to phpMyAdmin"
echo "  2. Create a new database called 'polynotice'"
echo "  3. Go to Import tab"
echo "  4. Select schema.sql and click Import"
echo ""

# Step 4: File permissions
echo "Setting file permissions..."
chmod -R 755 .
print_success "File permissions updated"

# Step 5: Configuration
echo ""
echo "Configuration Instructions:"
echo "======================================"
echo ""
echo "1. Edit .env file with your database credentials:"
echo "   DB_HOST=localhost"
echo "   DB_USER=root"
echo "   DB_PASS=your_password"
echo "   DB_NAME=polynotice"
echo ""

# Step 6: Summary
echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. Edit .env with your database credentials"
echo "2. Create the database:"
echo "   mysql -u root -p < schema.sql"
echo "3. Start your web server:"
echo "   php -S localhost:8000"
echo "4. Visit: http://localhost:8000/landing.html"
echo ""
print_success "Setup script completed successfully"
echo ""
echo "For more details, see SETUP.md"
