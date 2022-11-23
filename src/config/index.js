import dotenv from 'dotenv';
import * as path from 'path';
const envFileName = `.env${process.env.NODE_ENV && `.${process.env.NODE_ENV}`}`;
const pathToEnvFile = path.resolve(envFileName);
dotenv.config({ path: pathToEnvFile });
export const {
    PORT,
    NODE_ENV,
    MONGODB_URL,
    MONGODB_USER_NAME,
    MONGODB_PASSWORD,
    SERVER_VERSION,
    DB,
} = process.env;
