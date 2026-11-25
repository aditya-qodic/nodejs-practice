import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
    const maxRetries = 5;
    const retryDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(env.MONGODB_URI);
            console.log(`MongoDB connected successfully: ${new URL(env.MONGODB_URI).host}`);
            return;
        } catch (error) {
            console.error(
                `Database connection attempt ${attempt}/${maxRetries} failed:`,
                error.message
            );
            if (attempt === maxRetries) {
                throw new Error(
                    'Unable to connect to MongoDB after maximum retries.'
                );
            }
            await new Promise((resolve) =>
                setTimeout(resolve, retryDelay)
            );
        }
    }
};

export default connectDB;