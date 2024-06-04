import { connection } from "../server";
import express from "express";

const router = express.Router();

router.get("/film", (req, res) => {
  const query = "SELECT * FROM film";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    return res.json(results);
  });
});

router.post("/film", (req, res) => {
  const { filmName, filmDescription, poster, backdrop, premiere, filmCategory } = req.body;
  const query =
    "INSERT INTO film(id, filmName, filmDescription, poster, backdrop, premiere, filmCategory, isActive) " +
    "SELECT MAX(id) + 1, ?, ?, ?, ?, ?, ?, true FROM film";
  connection.query(query, [filmName, filmDescription, poster, backdrop, premiere, filmCategory], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.put("/film/:id", (req, res) => {
  const { filmName, filmDescription, poster, backdrop, premiere, filmCategory, isActive } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE film SET filmName = ?, filmDescription = ?, poster = ?, backdrop = ?, premiere = ?, filmCategory = ?, isActive = ? " +
    "WHERE id = ?";
  connection.query(
    query,
    [filmName, filmDescription, poster, backdrop, premiere, filmCategory, isActive, id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500).send("Server-side error");
        return;
      }
      res.json(results);
    }
  );
});

router.delete("/film/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE film SET isActive = false WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.delete("/film/cleanup", (req, res) => {
  const query = "DELETE FROM film WHERE isActive = false";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.get("/film/currentshow", (req, res) => {
  const query = "SELECT * FROM film WHERE DATEDIFF(premiere, NOW()) >= -14 AND isActive = true";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    return res.json(results);
  });
});

router.get("/film/:id", (req, res) => {
  const { id } = req.params;
  const query =
    'SELECT film.*, GROUP_CONCAT(category.categoryName separator ", ") as categories FROM film ' +
    "LEFT JOIN film_category ON film_category.filmId = film.id " +
    "LEFT JOIN category ON category.id = film_category.categoryId " +
    "WHERE film.id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    return res.json(results);
  });
});

export default router;
