import express from "express";
import { ShowSchedule } from "../models/show_schedule";
import { Film } from "../models/film";
import { Op, where } from "sequelize";
import dayjs from "dayjs";

const router = express.Router();

router.get("/show/active/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
        ["showDay", "ASC"],
        ["beginTime", "ASC"],
      ],
      include: [Film],
    });
    return res.json(show);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

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

router.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const show = await ShowSchedule.findOne({ where: { id }, include: [Film] });
    return res.json(show);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/show", async (req, res) => {
  try {
    const { film, showPrice, showDay, beginTime, room, isActive } = req.body;

    const beginTimeDate = new Date(beginTime);
    const beginTimeString = beginTimeDate.toLocaleTimeString("en-US", { hour12: false });
    const endTimeDate = new Date(beginTime);
    endTimeDate.setHours(endTimeDate.getHours() + 2);
    const endTimeString = endTimeDate.toLocaleTimeString("en-US", { hour12: false });

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
      return res.status(400).json({ message: "Show already exists at this time" });
    }

    const id = await ShowSchedule.findOne({ order: [["id", "DESC"]] });
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

    return res.json(newShow);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.put("/show/:id", async (req, res) => {
  const { film, showPrice, showDay, beginTime, room, isActive } = req.body;
  const { id } = req.params;
  try {
    const beginTimeDate = new Date(beginTime);
    const beginTimeString = beginTimeDate.toLocaleTimeString("en-US", { hour12: false });
    const endTimeDate = new Date(beginTime);
    endTimeDate.setHours(endTimeDate.getHours() + 2);
    const endTimeString = endTimeDate.toLocaleTimeString("en-US", { hour12: false });

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
      return res.status(400).json({ message: "Show already exists at this time" });
    }

    const show = await ShowSchedule.update(
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
    return res.json(show);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/show/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const show = await ShowSchedule.destroy({ where: { id } });
    return res.json(show);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

export default router;
