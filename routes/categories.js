const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get(`/categories`, async (req, res) => {
  console.log("Using Route : /categories");
  console.log(req.query);
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/category/create", async (req, res) => {
  console.log("Using route : /category/create");
  try {
    const { title } = req.fields;

    const newCategory = new Category({
      title: title,
    });
    newCategory.save();
    res.status(200).json({
      _id: newCategory._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/category/delete/:id", async (req, res) => {
  console.log("route : /category/delete");
  console.log(req.params);
  try {
    if (req.params.id) {
      await Category.findByIdAndDelete(req.params.id);

      res.json({ message: "Category removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
