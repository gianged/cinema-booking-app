import express from "express";
import { Ticket } from "../models/ticket";
import { ShowSchedule } from "../models/show_schedule";
import { Film } from "../models/film";
import { User } from "../models/user";

const router = express.Router();

router.get("/ticket/userview/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const ticket = await Ticket.findAll({
            where: {idUser: id},
            include: {
                model: ShowSchedule,
                include: [Film],
            },
        });
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

router.get("/ticket", async (req, res) => {
    try {
        const ticket = await Ticket.findAll({
            include: [
                {
                    model: User,
                },
                {model: ShowSchedule, include: [Film]},
            ],
        });
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

router.get("/ticket/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const ticket = await Ticket.findOne({where: {id}});
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

router.post("/ticket", async (req, res) => {
    try {
        const {idShow, idUser, ticketAmount, totalPrice} = req.body;
        const id = await Ticket.findOne({order: [["idTicket", "DESC"]]});
        const newId = id ? id.idTicket + 1 : 1;
        const ticket = await Ticket.create({
            idTicket: newId,
            idUser,
            idShow,
            ticketAmount,
            totalPrice,
        });
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

router.put("/ticket/:id", async (req, res) => {
    try {
        const {idShow, idUser, ticketAmount, totalPrice} = req.body;
        const {id} = req.params;
        const ticket = await Ticket.update(
            {idUser, idShow, ticketAmount, totalPrice},
            {where: {id}}
        );
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

router.delete("/ticket/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const ticket = await Ticket.destroy({where: {id}});
        return res.json(ticket);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Server-side error"});
    }
});

export default router;
