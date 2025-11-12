import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sha512 } from 'js-sha512';
import { User } from '../models/user';
import { verifyAdmin } from '../middleware/auth';
import logger from '../utils/logger';
import config from '../../config';

// Type definitions for request bodies
interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody {
  username: string;
  password: string;
}

interface CreateUserBody {
  username: string;
  password: string;
  role: string;
  isActive: number;
}

interface UpdateUserBody {
  password: string;
  role: string;
  isActive: number;
}

interface UserParams {
  id: string;
}

export default async function userRoutes(fastify: FastifyInstance) {
  // POST /security/login - Public endpoint
  fastify.post<{ Body: LoginBody }>(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            password: { type: 'string', minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      try {
        const { username, password } = request.body;
        const hashPassword = sha512(password);

        const user = await User.findOne({
          where: { username, password: hashPassword },
        });

        if (!user) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'User not found or incorrect credentials',
          });
        }

        // Check if user is active
        if (user.isActive === 0) {
          return reply.status(403).send({
            error: 'Forbidden',
            message: 'Account is deactivated',
          });
        }

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          {
            expiresIn: config.jwt.expiresIn,
          }
        );

        logger.info(`User logged in: ${username} (ID: ${user.id}, Role: ${user.role})`);

        return reply.send({
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
          },
          token,
        });
      } catch (err) {
        logger.error(`Login error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred during login',
        });
      }
    }
  );

  // POST /security/register - Public endpoint
  fastify.post<{ Body: RegisterBody }>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            password: { type: 'string', minLength: 6 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
      try {
        const { username, password } = request.body;
        const hashPassword = sha512(password);

        // Check if username exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Username already exists',
          });
        }

        // Get next ID
        const maxIdUser = await User.findOne({ order: [['id', 'DESC']] });
        const newId = maxIdUser ? maxIdUser.id + 1 : 1;

        // Create user
        const user = await User.create({
          id: newId,
          username,
          password: hashPassword,
          role: 'u',
          isActive: 1,
        });

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          {
            expiresIn: config.jwt.expiresIn,
          }
        );

        logger.info(`New user registered: ${username} (ID: ${user.id})`);

        return reply.status(201).send({
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
          },
          token,
        });
      } catch (err) {
        logger.error(`Registration error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An error occurred during registration',
        });
      }
    }
  );

  // GET /security/user - Get all users (Admin only)
  fastify.get(
    '/user',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const users = await User.findAll({
          attributes: ['id', 'username', 'role', 'isActive'],
        });

        return reply.send(users);
      } catch (err) {
        logger.error(`Get all users error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch users',
        });
      }
    }
  );

  // GET /security/user/:id - Get user by ID (Admin only)
  fastify.get<{ Params: UserParams }>(
    '/user/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const user = await User.findOne({
          where: { id },
          attributes: ['id', 'username', 'role', 'isActive'],
        });

        if (!user) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'User not found',
          });
        }

        return reply.send(user);
      } catch (err) {
        logger.error(`Get user error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch user',
        });
      }
    }
  );

  // POST /security/user - Create user (Admin only)
  fastify.post<{ Body: CreateUserBody }>(
    '/user',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password', 'role', 'isActive'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 50 },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['a', 'u'] },
            isActive: { type: 'number', enum: [0, 1] },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
      try {
        const { username, password, role, isActive } = request.body;
        const hashPassword = sha512(password);

        // Check if username exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'User already exists',
          });
        }

        // Get next ID
        const maxIdUser = await User.findOne({ order: [['id', 'DESC']] });
        const newId = maxIdUser ? maxIdUser.id + 1 : 1;

        // Create user
        const user = await User.create({
          id: newId,
          username,
          password: hashPassword,
          role,
          isActive,
        });

        logger.info(`Admin created user: ${username} (ID: ${user.id}, Role: ${role})`);

        return reply.status(201).send({
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        });
      } catch (err) {
        logger.error(`Create user error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to create user',
        });
      }
    }
  );

  // PUT /security/user/:id - Update user (Admin only)
  fastify.put<{ Params: UserParams; Body: UpdateUserBody }>(
    '/user/:id',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['password', 'role', 'isActive'],
          properties: {
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['a', 'u'] },
            isActive: { type: 'number', enum: [0, 1] },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: UserParams; Body: UpdateUserBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;
        const { password, role, isActive } = request.body;
        const hashPassword = sha512(password);

        const [affectedCount] = await User.update(
          { password: hashPassword, role, isActive },
          { where: { id } }
        );

        if (affectedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'User not found',
          });
        }

        logger.info(`Admin updated user ID: ${id}`);

        return reply.send({
          message: 'User updated successfully',
          affectedCount,
        });
      } catch (err) {
        logger.error(`Update user error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to update user',
        });
      }
    }
  );

  // DELETE /security/user/:id - Delete user (Admin only)
  fastify.delete<{ Params: UserParams }>(
    '/user/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const deletedCount = await User.destroy({ where: { id } });

        if (deletedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'User not found',
          });
        }

        logger.info(`Admin deleted user ID: ${id}`);

        return reply.send({
          message: 'User deleted successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Delete user error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to delete user',
        });
      }
    }
  );

  // DELETE /security/user/cleanup - Cleanup inactive users (Admin only)
  fastify.delete(
    '/user/cleanup',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const deletedCount = await User.destroy({ where: { isActive: 0 } });

        logger.info(`Admin cleaned up ${deletedCount} inactive users`);

        return reply.send({
          message: 'Inactive users cleaned up successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Cleanup users error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to cleanup users',
        });
      }
    }
  );
}
