# API & Integration Guide

This document explains how to interact with the Finance Dashboard API, including authentication, role permissions, rate limits, and how to use the interactive Swagger documentation.

---

## 1. Base URL & Global Rules

All functional endpoints are prefixed with `/api`. 
* **Local environment:** `http://localhost:5000/api`

### Rate Limiting
To protect against brute-force and DDoS attacks, the API enforces a global rate limit on all `/api` routes:
* **Limit:** 100 requests per IP address.
* **Window:** 15 minutes.
* **Exceeded:** Returns a `429 Too Many Requests` error.

---

## 2. Authentication Flow

This API uses **JSON Web Tokens (JWT)** for stateless authentication. 

1. **Register:** Send a `POST` request to `/api/auth/register` with an email, password, and desired role.
2. **Login:** Send a `POST` request to `/api/auth/login` with your credentials. If successful, the server returns a JWT.
3. **Authenticate:** For all protected routes, you must include this token in the HTTP `Authorization` header:
   ```text
   Authorization: Bearer <your_jwt_token_here>
   ```

*Note: If an Admin deactivates your account (Soft Delete), your JWT will be immediately rejected by the server on your next request, even if the token hasn't technically expired.*

---

## 3. Role-Based Access Control (RBAC)

The system enforces strict permission levels. Your access is determined by the `role` attached to your user account.

| Role | Permissions | Use Case |
| :--- | :--- | :--- |
| **ADMIN** | **Full Access.** Can create/update/delete transactions. Can view, update, and deactivate (soft-delete) other users. | System administrators and lead accountants. |
| **ANALYST** | **Read-Only (Transactions).** Can view all transactions and access the dashboard aggregations. Cannot mutate data. | Financial analysts reviewing performance. |
| **VIEWER** | **Dashboard Only.** Can only access the `/api/dashboard/summary` endpoint. Cannot view individual transactions or users. | Stakeholders who just need the high-level metrics. |

---

## 4. Interactive Documentation (Swagger)

Instead of manually crafting Postman requests, you can use the built-in Swagger UI to test every endpoint directly in your browser.

1. Start the server (`npm run dev`).
2. Navigate to **`http://localhost:5000/api-docs`**.
3. **To Authorize:**
   * Create an account or log in via the `Auth` section to get a token string.
   * Click the green **Authorize** (Padlock) button at the top right of the page.
   * Paste your token into the value box and click "Authorize". 
   * *Swagger will now automatically attach the Bearer token to all your subsequent test requests.*

---

## 5. Standard Responses & Error Handling

The API follows a predictable JSON response structure.

### Success (2xx)
```json
{
  "status": "success",
  "data": { ... }, 
  "message": "Optional success message"
}
```

### Errors (4xx & 5xx)
The global error handler ensures that your app never crashes from an unhandled promise and that sensitive database errors are not leaked to the client.

```json
{
  "error": "Human readable error message"
}
```

**Used Status Codes:**
* **`200 OK`:** The request succeeded.
* **`201 Created`:** A new resource was successfully created.
* **`400 Bad Request`:** Validation failed.
* **`401 Unauthorized`:** Missing, invalid, or expired JWT.
* **`403 Forbidden`:** You have a valid token, but your Role does not permit this action.
* **`404 Not Found`:** The requested resource does not exist.
* **`500 Internal Server Error`:** Something went wrong on the server side.
