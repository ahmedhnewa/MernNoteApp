import {
    cleanEnv, port, str
} from 'envalid';

export default cleanEnv(process.env, {
    MONGODB_CONNECTION: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    JWT_SECRET: str(),
    // PRODUCTION_MODE: bool()
});