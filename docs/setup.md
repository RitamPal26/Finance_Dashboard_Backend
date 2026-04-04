
# Setup Guide

This guide provides step-by-step instructions to set up the Finance Dashboard Backend on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (comes with Node.js)
* **A Relational Database** (PostgreSQL is highly recommended, though Prisma supports MySQL or SQLite)

---

## 1. Installation

First, clone the repository and install the required dependencies:

```bash
# Clone the repository (replace with your actual repo URL)
git clone https://github.com/RitamPal26/Finance_Dashboard_Backend.git

# Navigate into the project directory
cd finance_dashboard_backend

# Install dependencies
npm install
```

---

## 2. Environment Variables

The application relies on environment variables for secure configuration. Create a `.env` file in the root directory of your project:

```bash
touch .env
```

Open the `.env` file and add the following required variables. Update the `DATABASE_URL` to match your local database credentials.

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long

# Database (Example uses PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/finance_dashboard?schema=public"
DIRECT_URL="postgresql://nbehseu:nxxx@esjisen.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

---

## 3. Database Setup (Prisma)

This project uses Prisma ORM to manage the database schema. Once your `.env` file is ready and your database server is running, execute the following commands:

```bash
# Generate the Prisma Client
npx prisma generate

# Apply the schema to your database (creates the tables)
npx prisma db push
```

*Note: If you are using Prisma Studio to view your database GUI, you can run `npx prisma studio` at any time.*

---

## 4. Running the Application

You can start the server in either development or production mode.

**Development Mode (Hot-reloading enabled):**
```bash
npm run dev
```
The server will start at `http://localhost:5000`. You can view the interactive API documentation by navigating to `http://localhost:5000/api-docs` in your browser.

**Production Mode:**
```bash
# Compile TypeScript to JavaScript
npm run build

# Start the compiled application
npm start
```

---

## 5. Running Tests

This project uses **Vitest** and **Supertest** for integration testing. Ensure your database is running, then execute the test suite:

```bash
# Run all tests
npx vitest
```
*Tip: The integration tests will create temporary records in your database to verify the endpoints. It is recommended to use a separate test database or run these against a local development instance rather than production.*
