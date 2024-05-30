import express from "express";
import { connection } from "../server";
import { sha512 } from "js-sha512";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const hashPassword = sha512(password);
  const query = "SELECT * FROM user WHERE username = ? AND password = ?";
  connection.query(query, [username, hashPassword], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.get("/user", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.post("/user", (req, res) => {
  const { username, password, role } = req.body;
  const hashPassword = sha512(password);
  const query =
    "INSERT INTO user (id, username, password, role, isBanned, isActive) SELECT IFNULL(MAX(id), 0) + 1, ?, ?, ?, false, true FROM user";
  connection.query(query, [username, hashPassword, role], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.put("/user/:id", (req, res) => {
  const { password, isBanned, isActive } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE user SET password = ?, isBanned = ?, isActive = ? WHERE id = ?";
  connection.query(
    query,
    [password, isBanned, isActive, id],
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

router.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE user SET isActive = false WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

router.delete("/user/cleanup", (req, res) => {
  const query = "DELETE FROM user WHERE isActive = false";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500).send("Server-side error");
      return;
    }
    res.json(results);
  });
});

export default router;
