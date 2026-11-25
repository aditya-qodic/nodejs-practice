import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

let server;

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error('Application startup failed:', error.message);
        process.exit(1);
    }
};

const gracefulShutdown = async () => {
    console.log('SIGINT received. Starting graceful shutdown...');

    if (server) {
        server.close(async () => {
            console.log('HTTP server closed.');

            try {
                await mongoose.disconnect();
                console.log('MongoDB connection closed.');

                process.exit(0);
            } catch (error) {
                console.error('Shutdown failed:', error.message);
                process.exit(1);
            }
        });
    } else {
        await mongoose.disconnect();
        process.exit(0);
    }
};

process.on('SIGINT', gracefulShutdown);

startServer();