# Node.js Backend Skeleton

## Overview

This project provides a structured foundation for building a scalable Node.js backend application using Express.js and MongoDB.

It focuses on maintaining a clean, modular project structure following the layered architecture pattern, centralized environment configuration, reliable database connectivity with retry logic, graceful server shutdown, and consistent error handling.

---

## Project Structure

```text
Project Structure/
├── logs/                             # Application logs directory
├── scripts/                          # Utility & maintenance scripts
│   └── seed.js                       # Database seed script
├── src/                              # Application source code
│   ├── config/                       # Configuration modules
│   │   ├── db.js                     # MongoDB connection with retry logic
│   │   └── env.js                    # Environment variable validation & exports
│   ├── controllers/                  # HTTP request handlers & response formatting
│   │   └── userController.js         # User controller actions
│   ├── middlewares/                  # Express middlewares
│   │   ├── authMiddleware.js         # Authentication & authorization checks
│   │   └── errorHandler.js           # 404 & centralized error handlers
│   ├── models/                       # Mongoose schemas & data models
│   │   └── userModel.js              # User schema definition
│   ├── repositories/                 # Data access layer (database queries)
│   │   ├── index.js                  # Repository exports
│   │   └── userRepository.js         # User database operations
│   ├── routes/                       # Express route definitions
│   │   ├── index.js                  # Central route registry
│   │   └── userRoute.js              # User route endpoints
│   ├── services/                     # Business logic layer
│   │   └── userService.js            # User business logic & rules
│   ├── sockets/                      # Real-time WebSocket handlers
│   ├── utils/                        # Shared utility functions & constants
│   │   ├── constants.js              # Application constants & status codes
│   │   ├── helpers.js                # Helper functions
│   │   └── responseMessage.js        # Standardized API response messages
│   └── validators/                   # Request input validation schemas
│       └── validations.js            # Input validation middlewares
├── .env                              # Environment variable definitions (ignored by git)
├── .env.example                      # Template for required environment variables
├── .gitignore                        # Git ignore rules
├── app.js                            # Express app configuration & middleware pipeline
├── package.json                      # Project metadata & dependencies
├── package-lock.json                 # Pinned dependency tree
├── README.md                         # Project documentation
└── server.js                         # Application entry point & server lifecycle
```

---

## Architectural Data Flow

The project follows a **Layered Architecture (Separation of Concerns)** to ensure code maintainability, testability, and scalability:

```text
Client Request
      │
      ▼
┌───────────────┐
│    app.js     │  Express configuration, global middlewares, body parsers
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Routes     │  Endpoint definitions (src/routes/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Middlewares  │  Authentication, validation & route guards (src/middlewares/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Controllers  │  Extract request params/body & format HTTP response (src/controllers/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Services    │  Business logic, calculations & orchestration (src/services/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Repositories  │  Data access layer, database queries (src/repositories/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Models     │  Mongoose schemas and database models (src/models/)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    MongoDB    │  Database persistence
└───────────────┘
```

---

## Implementation Details

### 1. Project Structure & Directory Responsibilities

Each directory is designed to maintain a single, well-defined responsibility:

| Directory / File | Responsibility |
|---|---|
| `src/config/` | Centralizes external configuration. Contains `env.js` for environment variable loading/validation and `db.js` for database connectivity. |
| `src/models/` | Defines Mongoose schemas, indexes, hooks, and data models representing database collections. |
| `src/repositories/` | Direct data access layer. Isolates database queries (`find`, `create`, `update`, `delete`) so services are decoupled from the database client. |
| `src/services/` | Contains the core business logic, domain rules, data transformation, and workflow orchestration. |
| `src/controllers/` | Handles incoming HTTP requests, unpacks headers/parameters/body, delegates to services, and returns standardized HTTP responses. |
| `src/routes/` | Declares API endpoints, maps HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to controllers, and mounts endpoint-specific middlewares. |
| `src/middlewares/` | Reusable Express middleware functions including JWT authentication (`authMiddleware.js`), 404 handling, and centralized error processing (`errorHandler.js`). |
| `src/validators/` | Validates and sanitizes incoming request payloads before reaching controllers. |
| `src/utils/` | Shared utilities including constants (`constants.js`), helpers (`helpers.js`), and response messages (`responseMessage.js`). |
| `src/sockets/` | WebSocket event registration and real-time communication logic. |
| `scripts/` | Standalone utility scripts such as database seed scripts (`seed.js`) and database migration helpers. |
| `logs/` | Directory designated for application runtime and access logs. |
| `app.js` | Initializes Express, registers core middlewares, mounts routes, and sets up error handlers. |
| `server.js` | Main application entry point: establishes the database connection, launches the HTTP server, and manages graceful shutdowns. |

---

### 2. Environment Configuration (`src/config/env.js`)

- Centralized environment variable management using `dotenv`.
- Accesses `process.env` exclusively within `env.js` to avoid scattered environment reads.
- Validates all mandatory environment variables on application startup (`PORT`, `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`).
- Throws an informative error if any required variable is missing, preventing runtime failures.
- Exports an immutable, frozen configuration object (`Object.freeze(env)`).

---

### 3. Database Connection (`src/config/db.js`)

- Implements MongoDB connectivity using Mongoose.
- Features automatic retry logic with configurable maximum attempts (`maxRetries = 5`) and retry interval (`retryDelay = 2000ms`).
- Logs the database host upon successful connection.
- Halts startup if the connection cannot be established after all retry attempts.

---

### 4. Server Initialization & Lifecycle (`server.js`)

- Ensures the database connection is successfully established **before** binding to the HTTP port.
- Catches startup errors and terminates the process with an exit code of `1`.
- Implements **graceful shutdown** on `SIGINT` (e.g., Ctrl+C or process signals):
  1. Stops accepting new incoming HTTP connections.
  2. Allows in-flight requests to complete.
  3. Safely disconnects from MongoDB (`mongoose.disconnect()`).
  4. Exits the process cleanly with code `0`.

---

### 5. Express Application Setup (`app.js`)

- Instantiates the Express application.
- Configures JSON request body parsing (`express.json()`).
- Serves as the central registry for API routes.
- Enforces strict middleware ordering:
  1. Request parsers & logging.
  2. API route mounting.
  3. Catch-all 404 route handler.
  4. Centralized error handling middleware.

---

### 6. Centralized Error Handling (`src/middlewares/errorHandler.js`)

Provides unified, consistent error handling across the entire application.

#### 404 Route Not Found Middleware:
- Intercepts requests targeting undefined endpoints.
- Generates a standardized `404` error with code `ROUTE_NOT_FOUND`.
- Forwards the error via `next(error)` to the central error middleware.

#### Central Error Handling Middleware:
- Catches all synchronous and asynchronous errors forwarded via `next(err)`.
- Returns a consistent JSON error response structure.
- Hides internal error stack traces in production environments (`NODE_ENV === 'production'`) to prevent information leakage.
- Prints full error stack traces in development mode for debugging.

```json
{
  "success": false,
  "message": "Route not found",
  "code": "ROUTE_NOT_FOUND",
  "details": null
}
```

---

## Error Response Format

All application errors adhere to a standardized format:

| Property | Type | Description |
|---|---|---|
| `success` | `boolean` | Always `false` for error responses. |
| `message` | `string` | User-friendly error message describing the issue. |
| `code` | `string` | Machine-readable error code (e.g., `ROUTE_NOT_FOUND`, `VALIDATION_ERROR`). |
| `details` | `any` | Additional context or field-level validation errors (or `null`). |

---

## Key Objectives

- **Separation of Concerns:** Strict modularity across configuration, routing, business logic, data access, and models.
- **Fail-Fast Configuration:** Validate required environment variables at boot time.
- **Resilient Connectivity:** Retry database connections before allowing HTTP traffic.
- **Graceful Termination:** Complete ongoing requests and close database connections during shutdown.
- **Uniform API Responses:** Consistent JSON envelopes for both successes and errors.
- **Production Safety:** Prevent internal stack traces and secrets from leaking in API responses.

---

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimal and flexible web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **dotenv** - Environment variable management

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure all required values are configured:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/myapp
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the Application

**Development Mode (auto-restart on changes):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

**Seed Database:**

```bash
npm run seed
```
