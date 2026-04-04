# Finance_Dashboard_Backend

Welcome to the Finance Dashboard API. This is a secure, robust backend service built to manage financial records, track income and expenses, and provide aggregated analytics for dashboard visualizations. 

Built with Node.js, Express, TypeScript, and Prisma, this API enforces strict Role-Based Access Control (RBAC) to ensure data is securely managed across different user types (Admins, Analysts, and Viewers).

## Key Features
* **Secure Authentication:** JWT-based login and registration.
* **Role-Based Access Control:** Distinct permissions for Viewer, Analyst, and Admin roles.
* **Transaction Management:** Full CRUD operations with advanced date and category filtering.
* **Dashboard Analytics:** Optimized database aggregations for net balances, category totals, and monthly trends.
* **API Documentation:** Interactive Swagger UI integration.

## Tech Stack

* **Core:** Node.js, Express, TypeScript
* **Database & ORM:** PostgreSQL, Prisma
* **Security & Auth:** JWT, bcrypt, Helmet, Express Rate Limit
* **Data Validation:** Zod
* **Testing:** Vitest, Supertest
* **API Documentation:** Swagger UI
* **Code Quality & Tooling:** ESLint, Prettier, Husky, lint-staged

## Documentation

To keep this project organized, the complete documentation is divided into specific guides located in the `docs/` folder. Please refer to the following files to get started, understand the system, and run the code.

* **[Setup Guide](docs/setup.md)**: Environment requirements, installation steps, and database migration commands to get the server running locally.
* **[Architecture](docs/architecture.md)**: Details on the feature-based folder structure, database schema, and design patterns.
* **[API Guide](docs/api-guide.md)**: Explanation of the authentication flow, RBAC rules, rate limits, and how to use the Swagger interface.
* **[Testing](docs/testing.md)**: Instructions for running the Vitest integration tests and guidelines for maintaining API reliability.