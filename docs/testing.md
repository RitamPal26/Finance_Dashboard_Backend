# Testing Guide

Reliable APIs require robust testing. This project uses **Vitest** for running tests and **Supertest** for simulating HTTP requests. Our testing strategy focuses primarily on **Integration Tests**, ensuring that our Express routes, authentication middleware, and database queries all work together seamlessly.

## Testing Stack
* **Test Runner:** [Vitest](https://vitest.dev/)
* **HTTP Assertions:** [Supertest](https://github.com/ladjs/supertest)
* **Database Interations:** Prisma Client

---

## Running the Tests

Before running tests, ensure your local database is running. The tests will perform actual database read/write operations.

```bash
# Run the test suite once
npx vitest run

# Run tests in watch mode (auto-reloads on file changes)
npx vitest
```

---

## Guidelines for Writing New Tests

When adding new features or endpoints, follow these best practices for writing your tests:

### 1. Avoid Database Collisions
Because integration tests write to the actual database, hardcoding unique constraints (like emails) will cause the test to fail on the second run. **Always use dynamic data** for unique fields:
```typescript
// Bad: Will fail if "test@test.com" already exists
const email = "test@test.com";

// Good: Guarantees a unique email every test run
const email = `user-${Date.now()}@example.com`;
```

### 2. Test Both the "Happy" and "Sad" Paths
Don't just test that your API works when everything is perfect. You must test how it handles bad data and malicious attempts:
* **Happy Path:** Valid data -> Expect `200` or `201`.
* **Validation Error:** Missing fields -> Expect `400`.
* **Unauthorized:** No JWT provided -> Expect `401`.
* **Forbidden (RBAC):** Viewer trying to access an Admin route -> Expect `403`.

### 3. Always Clean Up
Unclosed database connections will cause memory leaks and cause Vitest to hang after the tests finish. Always include an `afterAll` hook to disconnect Prisma:

```typescript
import prisma from '../../config/db';

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

## Troubleshooting

**Error: "Prisma Client could not connect to the database"**
* Ensure your database server (e.g., PostgreSQL) is running.
* Verify that the `DATABASE_URL` in your `.env` file is correct.

**Error: "Unique constraint failed on the fields: (`email`)"**
* You are trying to create a user with an email that already exists from a previous test run. Update your test to generate a dynamic email.

**Error: Tests hang indefinitely after passing**
* You forgot to add `await prisma.$disconnect();` in your `afterAll` block.
