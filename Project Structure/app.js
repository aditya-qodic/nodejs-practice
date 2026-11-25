import express from 'express';

import {
    notFoundMiddleware,
    errorMiddleware
} from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

// Register API routes here.

// 404 handler
app.use(notFoundMiddleware);

// Central error handler
app.use(errorMiddleware);

export default app;