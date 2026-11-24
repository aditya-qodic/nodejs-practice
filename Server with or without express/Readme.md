
# Node.js Server: With and Without Express

## Project Overview

This project demonstrates how to create HTTP servers using Node.js, both with its built-in `http` module and the Express framework.

## Project Structure

```text
.
├── serverWithoutExpress.js
├── serverWithExpress.js
├── log.txt
└── README.md
```

## 1. Server Without Express (`serverWithoutExpress.js`)

Creating an HTTP server using Node.js's built-in `http` module.

**Concepts Covered:**
- Creating an HTTP server using `http.createServer()`.
- Parsing URLs and handling query parameters.
- Handling GET and POST requests.
- Reading request body streams using `req.on('data')` and `req.on('end')`.
- Parsing incoming JSON data using `JSON.parse()`.
- Sending JSON responses with appropriate `Content-Type` headers and HTTP status codes.
- Handling invalid JSON and unsupported HTTP methods.
- Logging incoming requests using the `fs` module.

## 2. Server With Express (`serverWithExpress.js`)

Creating an HTTP server using the Express framework.

**Concepts Covered:**
- Creating an Express application.
- Defining routes using `app.get()`.
- Accessing query parameters using `req.query`.
- Sending JSON responses using `res.json()`.
- Setting HTTP status codes using `res.status()`.
- Handling errors using `try-catch`.
- Handling undefined routes using middleware.

## 3. Library vs. Framework

- **Library:** A collection of reusable functions that developers call when needed. The developer controls the application flow.
- **Framework:** Provides a predefined structure and controls the application flow. Developers write code within its structure.

**Key Difference:** Inversion of Control (IoC).

## 4. Why Use Express Instead of Node.js HTTP APIs?

Node.js provides built-in HTTP APIs to create servers, but handling routing, request parsing, and responses manually can become complex.

Express simplifies development by providing:
- Easy routing and request handling.
- Middleware support.
- Simplified request and response handling.
- Built-in utilities for handling query parameters.
- Easier JSON body parsing using `express.json()`.
- Better code organization and error handling.

## Learning Outcome

Understand how Node.js handles HTTP requests and responses internally, how Express simplifies server development, and the practical differences between building a server with and without a framework.
