import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Category } from '../models/category';
import { verifyAdmin } from '../middleware/auth';
import logger from '../utils/logger';

// Type definitions for request bodies
interface CreateCategoryBody {
  categoryName: string;
  isActive: number;
}

interface UpdateCategoryBody {
  categoryName: string;
  isActive: number;
}

interface CategoryParams {
  id: string;
}

export default async function categoryRoutes(fastify: FastifyInstance) {
  // GET /category/active - Public endpoint (get active categories)
  fastify.get(
    '/active',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const category = await Category.findAll({ where: { isActive: 1 } });
        return reply.send(category);
      } catch (err) {
        logger.error(`Get active categories error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /category - Admin only (get all categories)
  fastify.get(
    '/',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const category = await Category.findAll();
        return reply.send(category);
      } catch (err) {
        logger.error(`Get all categories error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /category/:id - Admin only (get category by ID)
  fastify.get<{ Params: CategoryParams }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: CategoryParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const category = await Category.findOne({ where: { id } });

        if (!category) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Category not found',
          });
        }

        return reply.send(category);
      } catch (err) {
        logger.error(`Get category by ID error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // POST /category - Admin only (create category)
  fastify.post<{ Body: CreateCategoryBody }>(
    '/',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['categoryName', 'isActive'],
          properties: {
            categoryName: { type: 'string', minLength: 1, maxLength: 100 },
            isActive: { type: 'number', enum: [0, 1] },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateCategoryBody }>, reply: FastifyReply) => {
      try {
        const { categoryName, isActive } = request.body;

        const idCategory = await Category.findOne({ order: [['id', 'DESC']] });
        const newId = idCategory ? idCategory.id + 1 : 1;

        const category = await Category.create({
          id: newId,
          categoryName,
          isActive,
        });

        logger.info(`Admin created category: ${categoryName} (ID: ${newId})`);

        return reply.status(201).send(category);
      } catch (err) {
        logger.error(`Create category error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // PUT /category/:id - Admin only (update category)
  fastify.put<{ Params: CategoryParams; Body: UpdateCategoryBody }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['categoryName', 'isActive'],
          properties: {
            categoryName: { type: 'string', minLength: 1, maxLength: 100 },
            isActive: { type: 'number', enum: [0, 1] },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: CategoryParams; Body: UpdateCategoryBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { categoryName, isActive } = request.body;
        const { id } = request.params;

        const [affectedCount] = await Category.update(
          { categoryName, isActive },
          { where: { id } }
        );

        if (affectedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Category not found',
          });
        }

        logger.info(`Admin updated category ID: ${id}`);

        return reply.send({
          message: 'Category updated successfully',
          affectedCount,
        });
      } catch (err) {
        logger.error(`Update category error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // DELETE /category/:id - Admin only (delete category)
  fastify.delete<{ Params: CategoryParams }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: CategoryParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const deletedCount = await Category.destroy({ where: { id } });

        if (deletedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Category not found',
          });
        }

        logger.info(`Admin deleted category ID: ${id}`);

        return reply.send({
          message: 'Category deleted successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Delete category error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );
}
