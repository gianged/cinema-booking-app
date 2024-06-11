import express from "express";
import { ShowSchedule } from "../models/show_schedule";
import { Film } from "../models/film";
import { Op } from "sequelize";

const router = express.Router();

router.get("/show", async (req, res) => {
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
    return res.json(show);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/show", async (req, res) => {
  try {
    const { film, showPrice, beginTime, endTime, room } = req.body;

    const beginTimeDate = new Date(beginTime);
    const endTimeDate = new Date(endTime);
    const existingShow = await ShowSchedule.findOne({
      where: {
        beginTime: {
          [Op.lte]: endTimeDate,
        },
        endTime: {
          [Op.gte]: beginTimeDate,
        },
        room,
      },
    });

    if (existingShow) {
      return res.status(400).json({ message: "Show already exists at this time" });
    }

    const id = await ShowSchedule.findOne({ order: [["id", "DESC"]] });
    const newId = id ? id.id + 1 : 1;

    const newShow = await ShowSchedule.create({
      id: newId,
      film,
      showPrice,
      beginTime,
      endTime,
      room,
      isActive: 1,
    });

    return res.json(newShow);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

export default router;
