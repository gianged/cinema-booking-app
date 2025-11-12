import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Ticket } from '../models/ticket';
import { ShowSchedule } from '../models/show_schedule';
import { Film } from '../models/film';
import { User } from '../models/user';
import { verifyAdmin } from '../middleware/auth';
import logger from '../utils/logger';

// Type definitions for request bodies
interface CreateTicketBody {
  idShow: number;
  idUser: number;
  ticketAmount: number;
  totalPrice: number;
}

interface UpdateTicketBody {
  idShow: number;
  idUser: number;
  ticketAmount: number;
  totalPrice: number;
}

interface TicketParams {
  id: string;
}

export default async function ticketRoutes(fastify: FastifyInstance) {
  // GET /ticket/userview/:id - Public endpoint (get tickets for a user)
  fastify.get<{ Params: TicketParams }>(
    '/userview/:id',
    async (request: FastifyRequest<{ Params: TicketParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const ticket = await Ticket.findAll({
          where: { idUser: id },
          include: {
            model: ShowSchedule,
            include: [Film],
          },
        });

        return reply.send(ticket);
      } catch (err) {
        logger.error(`Get user tickets error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /ticket - Admin only (get all tickets)
  fastify.get(
    '/',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const ticket = await Ticket.findAll({
          include: [
            {
              model: User,
            },
            { model: ShowSchedule, include: [Film] },
          ],
        });

        return reply.send(ticket);
      } catch (err) {
        logger.error(`Get all tickets error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // GET /ticket/:id - Public endpoint (get ticket by ID)
  fastify.get<{ Params: TicketParams }>(
    '/:id',
    async (request: FastifyRequest<{ Params: TicketParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const ticket = await Ticket.findOne({ where: { id } });

        if (!ticket) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Ticket not found',
          });
        }

        return reply.send(ticket);
      } catch (err) {
        logger.error(`Get ticket by ID error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // POST /ticket - Public endpoint (create ticket - booking)
  fastify.post<{ Body: CreateTicketBody }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['idShow', 'idUser', 'ticketAmount', 'totalPrice'],
          properties: {
            idShow: { type: 'number' },
            idUser: { type: 'number' },
            ticketAmount: { type: 'number', minimum: 1 },
            totalPrice: { type: 'number', minimum: 0 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateTicketBody }>, reply: FastifyReply) => {
      try {
        const { idShow, idUser, ticketAmount, totalPrice } = request.body;

        const id = await Ticket.findOne({ order: [['idTicket', 'DESC']] });
        const newId = id ? id.idTicket + 1 : 1;

        const ticket = await Ticket.create({
          idTicket: newId,
          idUser,
          idShow,
          ticketAmount,
          totalPrice,
        });

        logger.info(
          `Ticket created: User ${idUser}, Show ${idShow}, Amount ${ticketAmount} (ID: ${newId})`
        );

        return reply.status(201).send(ticket);
      } catch (err) {
        logger.error(`Create ticket error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // PUT /ticket/:id - Admin only (update ticket)
  fastify.put<{ Params: TicketParams; Body: UpdateTicketBody }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['idShow', 'idUser', 'ticketAmount', 'totalPrice'],
          properties: {
            idShow: { type: 'number' },
            idUser: { type: 'number' },
            ticketAmount: { type: 'number', minimum: 1 },
            totalPrice: { type: 'number', minimum: 0 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: TicketParams; Body: UpdateTicketBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { idShow, idUser, ticketAmount, totalPrice } = request.body;
        const { id } = request.params;

        const [affectedCount] = await Ticket.update(
          { idUser, idShow, ticketAmount, totalPrice },
          { where: { id } }
        );

        if (affectedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Ticket not found',
          });
        }

        logger.info(`Admin updated ticket ID: ${id}`);

        return reply.send({
          message: 'Ticket updated successfully',
          affectedCount,
        });
      } catch (err) {
        logger.error(`Update ticket error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );

  // DELETE /ticket/:id - Admin only (delete ticket)
  fastify.delete<{ Params: TicketParams }>(
    '/:id',
    {
      preHandler: [verifyAdmin],
    },
    async (request: FastifyRequest<{ Params: TicketParams }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const deletedCount = await Ticket.destroy({ where: { id } });

        if (deletedCount === 0) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Ticket not found',
          });
        }

        logger.info(`Admin deleted ticket ID: ${id}`);

        return reply.send({
          message: 'Ticket deleted successfully',
          deletedCount,
        });
      } catch (err) {
        logger.error(`Delete ticket error: ${err}`);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Server-side error',
        });
      }
    }
  );
}
