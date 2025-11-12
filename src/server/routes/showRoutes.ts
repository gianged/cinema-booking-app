import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ShowSchedule } from '../models/show_schedule';
import { Film } from '../models/film';
import { Op } from 'sequelize';
import { verifyAdmin } from '../middleware/auth';
import logger from '../utils/logger';

// Type definitions for request bodies
interface CreateShowBody {
  film: number;
  showPrice: number;
  showDay: string;
  beginTime: string;
  room: number;
  isActive: boolean;
}

interface UpdateShowBody {
  film: number;
  showPrice: number;
  showDay: string;
  beginTime: string;
  room: number;
  isActive: boolean;
}

interface ShowParams {
  id: string;
}

export default async function showRoutes(fastify: FastifyInstance) {
  // GET /show/active/:id - Public endpoint (get active shows for a film)
  fastify.get<{ Params: ShowParams }>(
    '/active/:id',
    async (request: FastifyRequest<{ Params: ShowParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const today = new Date();
        today.setHours(7, 0, 0, 0);

        const show = await ShowSchedule.findAll({
          where: {
            film: id,
            beginTime: {
              [Op.gte]: today,
            },
            isActive: true,
          },
          order: [
            ['showDay', 'ASC'],
            ['beginTime', 'ASC'],
          ],
          include: [Film],
        });

        return reply.send(show);
      } catch (err) {
        logger.error(`Get active shows for film error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /show - Admin only (get all shows)
  fastify.get(
    '/',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const today = new Date();
        today.setHours(7, 0, 0, 0);

        const show = await ShowSchedule.findAll({
          where: {
            beginTime: {
              [Op.gte]: today,
            },
          },
          include: [Film],
        });

        return reply.send(show);
      } catch (err) {
        logger.error(`Get all shows error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /show/:id - Public endpoint (get show by ID)
  fastify.get<{ Params: ShowParams }>(
    '/:id',
    async (request: FastifyRequest<{ Params: ShowParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const show = await ShowSchedule.findOne({ where: { id }, include: [Film] });

        if (!show) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Show not found',
          });
        }

        return reply.send(show);
      } catch (err) {
        logger.error(`Get show by ID error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // POST /show - Admin only (create show)
  fastify.post<{ Body: CreateShowBody }>(
    '/',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['film', 'showPrice', 'showDay', 'beginTime', 'room', 'isActive'],
          properties: {
            film: { type: 'number' },
            showPrice: { type: 'number', minimum: 0 },
            showDay: { type: 'string' },
            beginTime: { type: 'string' },
            room: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateShowBody }>, reply: FastifyReply) => {
      try {
        const { film, showPrice, showDay, beginTime, room, isActive } = request.body;

        const beginTimeDate = new Date(beginTime);
        const beginTimeString = beginTimeDate.toLocaleTimeString('en-US', { hour12: false });
        const endTimeDate = new Date(beginTime);
        endTimeDate.setHours(endTimeDate.getHours() + 2);
        const endTimeString = endTimeDate.toLocaleTimeString('en-US', { hour12: false });

        const existingShow = await ShowSchedule.findOne({
          where: {
            showDay: {
              [Op.eq]: showDay,
            },
            [Op.or]: {
              beginTime: {
                [Op.lte]: endTimeString,
              },
              endTime: {
                [Op.gte]: beginTimeString,
              },
            },
            room: {
              [Op.eq]: room,
            },
          },
        });

        if (existingShow) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Show already exists at this time',
          });
        }

        const id = await ShowSchedule.findOne({ order: [['id', 'DESC']] });
        const newId = id ? id.id + 1 : 1;

        const newShow = await ShowSchedule.create({
          id: newId,
          film,
          showPrice,
          showDay,
          beginTime: beginTimeString,
          endTime: endTimeString,
          room,
          isActive,
        });

        logger.info(`Admin created show: Film ${film}, Room ${room} (ID: ${newId})`);

        return reply.status(201).send(newShow);
      } catch (err) {
        logger.error(`Create show error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // PUT /show/:id - Admin only (update show)
  fastify.put<{ Params: ShowParams; Body: UpdateShowBody }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['film', 'showPrice', 'showDay', 'beginTime', 'room', 'isActive'],
          properties: {
            film: { type: 'number' },
            showPrice: { type: 'number', minimum: 0 },
            showDay: { type: 'string' },
            beginTime: { type: 'string' },
            room: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: ShowParams; Body: UpdateShowBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { film, showPrice, showDay, beginTime, room, isActive } = request.body;
        const { id } = request.params;

        const beginTimeDate = new Date(beginTime);
        const beginTimeString = beginTimeDate.toLocaleTimeString('en-US', { hour12: false });
        const endTimeDate = new Date(beginTime);
        endTimeDate.setHours(endTimeDate.getHours() + 2);
        const endTimeString = endTimeDate.toLocaleTimeString('en-US', { hour12: false });

        const existingShow = await ShowSchedule.findOne({
          where: {
            showDay: {
              [Op.eq]: showDay,
            },
            [Op.or]: {
              beginTime: {
                [Op.lte]: endTimeString,
              },
              endTime: {
                [Op.gte]: beginTimeString,
              },
            },
            room: {
              [Op.eq]: room,
            },
          },
        });

        if (existingShow) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Show already exists at this time',
          });
        }

        const [affectedCount] = await ShowSchedule.update(
          {
            film,
            showPrice,
            showDay,
            beginTime: beginTimeString,
            endTime: endTimeString,
            room,
            isActive,
          },
          { where: { id } }
        );

        if (affectedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Show not found',
          });
        }

        logger.info(`Admin updated show ID: ${id}`);

        return reply.send({
          message: 'Show updated successfully',
          affectedCount,
        });
      } catch (err) {
        logger.error(`Update show error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // DELETE /show/:id - Admin only (delete show)
  fastify.delete<{ Params: ShowParams }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: ShowParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const deletedCount = await ShowSchedule.destroy({ where: { id } });

        if (deletedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Show not found',
          });
        }

        logger.info(`Admin deleted show ID: ${id}`);

        return reply.send({
          message: 'Show deleted successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Delete show error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );
}
