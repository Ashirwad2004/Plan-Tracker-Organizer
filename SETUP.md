# SmartPlan Setup Guide

## Prerequisites

This project requires:
- Node.js (already installed ✓)
- PostgreSQL database
- Environment variables configured

## Quick Setup Options

### Option 1: Use a Free Cloud PostgreSQL Database (Recommended for Quick Start)

1. **Sign up for a free PostgreSQL service:**
   - [Supabase](https://supabase.com) - Free tier available
   - [Neon](https://neon.tech) - Free tier available
   - [ElephantSQL](https://www.elephantsql.com) - Free tier available

2. **Get your database connection string** (format: `postgresql://user:password@host:port/database`)

3. **Create a `.env` file** in the project root:
   ```
   DATABASE_URL=postgresql://your_connection_string_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Push the database schema:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

### Option 2: Install PostgreSQL Locally

1. **Download and install PostgreSQL:**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Or use installer: [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

2. **Create a database:**
   ```sql
   CREATE DATABASE smartplan;
   ```

3. **Create a `.env` file** in the project root:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartplan
   PORT=5000
   NODE_ENV=development
   ```
   (Replace `your_password` with your PostgreSQL password)

4. **Push the database schema:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

### Option 3: Use Docker (if Docker is installed)

1. **Start PostgreSQL with Docker:**
   ```bash
   docker run --name smartplan-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=smartplan -p 5432:5432 -d postgres
   ```

2. **Create a `.env` file** in the project root:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartplan
   PORT=5000
   NODE_ENV=development
   ```

3. **Push the database schema:**
   ```bash
   npm run db:push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Running the Project

Once your database is set up:

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up the database schema:**
   ```bash
   npm run db:push
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5000`

## Troubleshooting

- **"DATABASE_URL must be set"**: Make sure you've created a `.env` file with the DATABASE_URL variable
- **Connection errors**: Verify your database is running and the connection string is correct
- **Port already in use**: Change the PORT in `.env` to a different port (e.g., 5001)

