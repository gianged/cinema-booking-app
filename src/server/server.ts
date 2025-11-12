import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import formbody from '@fastify/formbody';
import config from '../config';
import { connectDatabase } from './database';
import logger from './utils/logger';

// Import routes
import userRoutes from './routes/userRoutes';
import filmRoutes from './routes/filmRoutes';
import showRoutes from './routes/showRoutes';
import categoryRoutes from './routes/categoryRoutes';
import ticketRoutes from './routes/ticketRoutes';

// Create Fastify instance
const server = fastify({
  logger: false, // We're using Winston instead
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  // Form body parser
  await server.register(formbody);

  // JWT
  await server.register(jwt, {
    secret: config.jwt.secret,
  });
}

// Register routes
async function registerRoutes() {
  await server.register(userRoutes, { prefix: '/security' });
  await server.register(filmRoutes);
  await server.register(showRoutes);
  await server.register(categoryRoutes);
  await server.register(ticketRoutes);
}

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
async function start() {
  try {
    // Connect to database
    await connectDatabase();

    // Register plugins
    await registerPlugins();

    // Register routes
    await registerRoutes();

    // Start listening
    await server.listen({
      host: config.server.host,
      port: config.server.port,
    });

    logger.info(`✓ Server started successfully`);
    logger.info(`  Environment: ${config.server.env}`);
    logger.info(`  URL: http://${config.server.host}:${config.server.port}`);
    logger.info(`  Health: http://${config.server.host}:${config.server.port}/health`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

// Start the server
start();

export default server;
