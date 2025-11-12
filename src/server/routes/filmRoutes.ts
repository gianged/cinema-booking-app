import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import { Film } from '../models/film';
import { FilmCategory } from '../models/film_category';
import { Category } from '../models/category';
import { verifyAdmin } from '../middleware/auth';
import logger from '../utils/logger';

// Type definitions for request bodies
interface CreateFilmBody {
  filmName: string;
  filmDescription: string;
  poster?: string;
  backdrop?: string;
  premiere: string;
  isActive: boolean;
  trailer: string;
  categories?: number[];
}

interface UpdateFilmBody {
  filmName: string;
  filmDescription: string;
  premiere: string;
  categories?: number[];
  trailer: string;
  isActive: boolean;
}

interface FilmParams {
  id: string;
}

export default async function filmRoutes(fastify: FastifyInstance) {
  // GET /film/currentshow - Public endpoint (films from last 14 days)
  fastify.get(
    '/currentshow',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const date = new Date();
        date.setDate(date.getDate() - 14);
        const film = await Film.findAll({
          where: { premiere: { [Op.gt]: date }, isActive: true },
        });
        return reply.send(film);
      } catch (err) {
        logger.error(`Get current show films error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /film/active - Public endpoint (all active films)
  fastify.get(
    '/active',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const film = await Film.findAll({ where: { isActive: true } });
        return reply.send(film);
      } catch (err) {
        logger.error(`Get active films error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /film/:id - Public endpoint (get film by ID with categories)
  fastify.get<{ Params: FilmParams }>(
    '/:id',
    async (request: FastifyRequest<{ Params: FilmParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const film = await Film.findOne({
          where: { id },
          include: [
            {
              model: FilmCategory,
              include: [Category],
            },
          ],
        });

        if (!film) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Film not found',
          });
        }

        return reply.send(film);
      } catch (err) {
        logger.error(`Get film by ID error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // DELETE /film/cleanup - Admin only (delete inactive films)
  fastify.delete(
    '/cleanup',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const deletedCount = await Film.destroy({ where: { isActive: false } });
        logger.info(`Admin cleaned up ${deletedCount} inactive films`);
        return reply.send({
          message: 'Inactive films cleaned up successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Cleanup films error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /film - Admin only (get all films)
  fastify.get(
    '/',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const film = await Film.findAll({
          include: {
            model: FilmCategory,
            include: [Category],
          },
        });

        if (!film) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Film not found',
          });
        }

        return reply.send(film);
      } catch (err) {
        logger.error(`Get all films error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // POST /film - Admin only (create film)
  fastify.post<{ Body: CreateFilmBody }>(
    '/',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['filmName', 'filmDescription', 'premiere', 'trailer', 'isActive'],
          properties: {
            filmName: { type: 'string', minLength: 1 },
            filmDescription: { type: 'string', minLength: 1 },
            poster: { type: 'string' },
            backdrop: { type: 'string' },
            premiere: { type: 'string' },
            isActive: { type: 'boolean' },
            trailer: { type: 'string' },
            categories: {
              type: 'array',
              items: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateFilmBody }>, reply: FastifyReply) => {
      try {
        const { filmName, filmDescription, poster, backdrop, premiere, isActive, trailer, categories } =
          request.body;

        const posterBase64Data = poster ? poster.replace(/^data:([A-Za-z-+/]+);base64,/, '') : '';
        const backdropBase64Data = backdrop ? backdrop.replace(/^data:([A-Za-z-+/]+);base64,/, '') : '';
        const posterBuffer = Buffer.from(posterBase64Data, 'base64');
        const backdropBuffer = Buffer.from(backdropBase64Data, 'base64');

        const findId = await Film.findOne({ order: [['id', 'DESC']] });
        const newId = findId ? findId.id + 1 : 1;

        const film = await Film.create({
          id: newId,
          filmName,
          filmDescription,
          posterBuffer,
          backdropBuffer,
          premiere,
          trailer,
          isActive,
        });

        if (categories) {
          categories.forEach((category: any) => {
            FilmCategory.create({
              filmId: newId,
              categoryId: category,
            });
          });
        }

        logger.info(`Admin created film: ${filmName} (ID: ${newId})`);

        //TODO: Fix this insert

        return reply.status(201).send(film);
      } catch (err) {
        logger.error(`Create film error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // PUT /film/:id - Admin only (update film)
  fastify.put<{ Params: FilmParams; Body: UpdateFilmBody }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['filmName', 'filmDescription', 'premiere', 'trailer', 'isActive'],
          properties: {
            filmName: { type: 'string', minLength: 1 },
            filmDescription: { type: 'string', minLength: 1 },
            premiere: { type: 'string' },
            trailer: { type: 'string' },
            isActive: { type: 'boolean' },
            categories: {
              type: 'array',
              items: { type: 'number' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: FilmParams; Body: UpdateFilmBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { filmName, filmDescription, premiere, categories, trailer, isActive } = request.body;
        const { id } = request.params;

        const [affectedCount] = await Film.update(
          {
            filmName,
            filmDescription,
            premiere,
            trailer,
            isActive,
          },
          { where: { id } }
        );

        if (categories) {
          await FilmCategory.destroy({ where: { filmId: id } });
          categories.forEach((category: any) => {
            FilmCategory.create({
              filmId: id,
              categoryId: category,
            });
          });
        }

        logger.info(`Admin updated film ID: ${id}`);

        //TODO: Fix this update as well

        return reply.send({
          message: 'Film updated successfully',
          affectedCount,
        });
      } catch (err) {
        logger.error(`Update film error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // DELETE /film/:id - Admin only (delete film)
  fastify.delete<{ Params: FilmParams }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: FilmParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const deletedCount = await Film.destroy({ where: { id } });

        if (deletedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Film not found',
          });
        }

        logger.info(`Admin deleted film ID: ${id}`);

        return reply.send({
          message: 'Film deleted successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Delete film error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );
}
