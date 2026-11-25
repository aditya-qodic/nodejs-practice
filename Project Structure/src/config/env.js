import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET'
];

const missingEnv = requiredEnv.filter(
    (key) => !process.env[key]
);

if (missingEnv.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnv.join(', ')}`
    );
}

const env = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
};

export default Object.freeze(env);