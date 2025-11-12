import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  server: {
    host: string;
    port: number;
    env: string;
  };
  database: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: parseInt(process.env.SERVER_PORT || '4000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    name: process.env.DB_NAME || 'cinema-booking-app-db',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '8000', 10),
    dialect: (process.env.DB_DIALECT as any) || 'mysql',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required configuration
if (!config.database.password) {
  throw new Error('DB_PASSWORD is required in environment variables');
}

if (config.jwt.secret === 'change_this_secret') {
  console.warn('⚠️  WARNING: Using default JWT secret. Please set JWT_SECRET in .env file');
}

export default config;
