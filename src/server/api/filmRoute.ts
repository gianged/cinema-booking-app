import express from "express";
import { Op } from "sequelize";
import { Film } from "../models/film";
import { FilmCategory } from "../models/film_category";
import { Category } from "../models/category";

const router = express.Router();

router.get("/film/currentshow", async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 14);
    const film = await Film.findAll({ where: { premiere: { [Op.gt]: date }, isActive: true } });
    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.get("/film/:id", async (req, res) => {
  const { id } = req.params;
  try {
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
      return res.status(404).json({ message: "Film not found" });
    }

    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/film/cleanup", async (req, res) => {
  try {
    const film = await Film.destroy({ where: { isActive: false } });
    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.get("/film", async (req, res) => {
  try {
    const film = await Film.findAll({
      include: {
        model: FilmCategory,
        include: [Category],
      },
    });

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/film", async (req, res) => {
  const { filmName, filmDescription, poster, backdrop, premiere, filmCategory } = req.body;
  try {
    const findId = await Film.findOne({ order: ["id", "DESC"] });
    const newId = findId ? findId.id + 1 : 1;
    const film = await Film.create({
      id: newId,
      filmName,
      filmDescription,
      poster,
      backdrop,
      premiere,
      isActive: 1,
    });
    filmCategory.forEach((category: any) => {
      FilmCategory.create({
        filmId: newId,
        categoryId: category,
      });
    });

    //TODO: Fix this insert

    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.put("/film/:id", async (req, res) => {
  const { filmName, filmDescription, poster, backdrop, premiere, filmCategory, isActive } =
    req.body;
  const { id } = req.params;
  try {
    const film = await Film.update(
      {
        filmName,
        filmDescription,
        poster,
        backdrop,
        premiere,
        isActive,
      },
      {
        where: { id },
      }
    );
    FilmCategory.destroy({ where: { filmId: id } });
    filmCategory.forEach((category: any) => {
      FilmCategory.create({
        filmId: id,
        categoryId: category,
      });
    });

    //TODO: Fix this update as well

    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/film/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const film = await Film.destroy({ where: { id } });
    return res.json(film);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

export default router;
