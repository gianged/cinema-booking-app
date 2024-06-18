import express from "express";
import { sha512 } from "js-sha512";
import { User } from "../models/user";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = sha512(password);
    const user = await User.findOne({ where: { username: username, password: hashPassword } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = sha512(password);
    const check = await User.findOne({ where: { username: username } });
    if (check) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const maxId = await User.findOne({ order: [["id", "DESC"]] });
    const newId = maxId ? maxId.id + 1 : 1;
    const user = await User.create({
      id: newId,
      username: username,
      password: hashPassword,
      role: "u",
      isActive: 1,
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/user/cleanup", async (req, res) => {
  try {
    const user = await User.destroy({ where: { isActive: false } });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id: id } });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await User.findAll();
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/user", async (req, res) => {
  try {
    const { username, password, role, isActive } = req.body;
    const hashPassword = sha512(password);
    const check = await User.findOne({ where: { username: username } });
    if (check) {
      return res.status(400).json({ message: "User already exists" });
    }
    const idUser = await User.findOne({ order: [["id", "DESC"]] });
    const newId = idUser ? idUser.id + 1 : 1;
    const user = await User.create({
      id: newId,
      username: username,
      password: hashPassword,
      role: role,
      isActive: isActive,
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const { password, role, isActive } = req.body;
    const { id } = req.params;
    const hashPassword = sha512(password);
    const user = await User.update(
      { password: hashPassword, role: role, isActive: isActive },
      { where: { id: id } }
    );
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.destroy({ where: { id: id } });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

export default router;
