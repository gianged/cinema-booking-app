import { Sequelize } from 'sequelize';
import mysql from 'mysql2';
import config from '../config';
import logger from './utils/logger';

// Create singleton Sequelize instance
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    dialectModule: mysql,
    logging: config.server.env === 'development'
      ? (msg: string) => logger.debug(msg)
      : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  }
);

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✓ Database connection established successfully');
    logger.info(`  Connected to: ${config.database.name}@${config.database.host}:${config.database.port}`);
  } catch (error) {
    logger.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
