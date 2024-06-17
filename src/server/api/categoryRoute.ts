import express from "express";
import { Category } from "../models/category";

const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const category = await Category.findAll();
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.get("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id: id } });
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.post("/category", async (req, res) => {
  try {
    const { categoryName, isActive } = req.body;
    const idCategory = await Category.findOne({ order: [["id", "DESC"]] });
    const newId = idCategory ? idCategory.id + 1 : 1;
    const category = await Category.create({
      id: newId,
      categoryName: categoryName,
      isActive: isActive,
    });
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.put("/category/:id", async (req, res) => {
  try {
    const { categoryName, isActive } = req.body;
    const { id } = req.params;
    const category = await Category.update(
      { categoryName: categoryName, isActive: isActive },
      { where: { id: id } }
    );
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

router.delete("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.destroy({ where: { id: id } });
    return res.json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server-side error" });
  }
});

export default router;
