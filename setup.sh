#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Paths - Full Stack Application${NC}\n"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists pnpm; then
    echo -e "${YELLOW}⚠️  pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}✅ All prerequisites met${NC}\n"

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Step 2: Start PostgreSQL with Docker
echo -e "${BLUE}🐘 Starting PostgreSQL database...${NC}"
docker-compose up -d
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is ready
until docker exec paths-postgres pg_isready -U paths_user -d paths_db > /dev/null 2>&1; do
    echo "Waiting for database to be ready..."
    sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is running${NC}\n"

# Step 3: Setup environment files
echo -e "${BLUE}🔧 Setting up environment files...${NC}"

# API .env
if [ ! -f "apps/api/.env" ]; then
    cat > apps/api/.env << 'EOF'
# Database
DATABASE_URL="postgresql://paths_user:paths_password@localhost:5433/paths_db?schema=public"

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000
EOF
    echo -e "${GREEN}✅ Created apps/api/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/api/.env already exists, skipping${NC}"
fi

# Web .env.local
if [ ! -f "apps/web/.env.local" ]; then
    cat > apps/web/.env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✅ Created apps/web/.env.local${NC}"
else
    echo -e "${YELLOW}⚠️  apps/web/.env.local already exists, skipping${NC}"
fi

echo ""

# Step 4: Setup database
echo -e "${BLUE}🗄️  Setting up database schema...${NC}"
cd packages/db
pnpm db:generate
pnpm db:push
echo -e "${GREEN}✅ Database schema created${NC}\n"

# Step 5: Seed database
echo -e "${BLUE}🌱 Seeding database with sample data...${NC}"
pnpm db:seed
echo -e "${GREEN}✅ Database seeded${NC}\n"

cd ../..

# Step 6: Build packages
echo -e "${BLUE}🔨 Building shared packages...${NC}"
pnpm build --filter=@workspace/db
echo -e "${GREEN}✅ Packages built${NC}\n"

echo -e "${GREEN}🎉 Setup complete!${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Start the API server:     ${YELLOW}pnpm dev --filter=api${NC}"
echo -e "  2. Start the web app:        ${YELLOW}pnpm dev --filter=web${NC}"
echo -e "  3. Open your browser:        ${YELLOW}http://localhost:3000${NC}"
echo -e "\n${BLUE}Useful commands:${NC}"
echo -e "  • View database:             ${YELLOW}pnpm --filter=@workspace/db db:studio${NC}"
echo -e "  • Stop database:             ${YELLOW}docker-compose down${NC}"
echo -e "  • Reset database:            ${YELLOW}pnpm --filter=@workspace/db db:push --force-reset${NC}"
echo ""
