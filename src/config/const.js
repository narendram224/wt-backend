export const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL || 'http://localhost:3001',
    MONGODB_USER_NAME: process.env.MONGODB_USER || '',
    MONGODB_PASSWORD: process.env.MONGODB_PASS || '',
};
