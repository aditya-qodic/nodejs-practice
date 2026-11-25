import env from '../config/env.js';

// Handles routes that do not exist
export const notFoundMiddleware = (req, res, next) => {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl}`
    );

    error.statusCode = 404;
    error.code = 'ROUTE_NOT_FOUND';

    next(error);
};

// Handles all application errors
export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || 'Internal server error',
        code: err.code || 'INTERNAL_SERVER_ERROR',
        details: err.details || null
    };

    if (env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    return res.status(statusCode).json(response);
};