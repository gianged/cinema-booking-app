import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../utils/logger';

// Extend FastifyRequest to include user property
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}

// Verify JWT token
export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    logger.warn(`Authentication failed: ${err}`);
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }
}

// Verify admin role
export async function verifyAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();

    const user = request.user as any;

    if (!user || user.role !== 'a') {
      logger.warn(`Authorization failed: User ${user?.username} (role: ${user?.role}) attempted admin action`);
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }
  } catch (err) {
    logger.warn(`Authorization failed: ${err}`);
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }
}

// Optional auth - doesn't fail if no token
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    // Silently fail - optional auth
  }
}
