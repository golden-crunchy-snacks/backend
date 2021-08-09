const express = require("express");
const router = express.Router();
const SubCategory = require("../models/SubCategory");

router.get(`/subcategories`, async (req, res) => {
  console.log("Using Route : /subcategories");
  console.log(req.query);
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post(`/subcategories/:id`, async (req, res) => {
  console.log("Using Route : /subcategories/:id");
  console.log(req.params.id);
  try {
    const newSubCategories = [];
    const subCategories = await SubCategory.find();
    console.log(subCategories);
    for (let i = 0; i < subCategories.length; i++) {
      if (subCategories[i].categoryId === req.params.id) {
        newSubCategories.push(subCategories[i]);
      }
    }
    res.status(200).json(newSubCategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/subcategory/create", async (req, res) => {
  console.log("Using route : /subcategory/create");
  try {
    const { title, categoryId } = req.fields;

    const newSubCategory = new SubCategory({
      title: title,
      categoryId: categoryId,
    });
    newSubCategory.save();
    res.status(200).json({
      _id: newSubCategory._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/subcategory/delete/:id", async (req, res) => {
  console.log("route : /subCategory/delete");
  console.log(req.params);
  try {
    if (req.params.id) {
      await SubCategory.findByIdAndDelete(req.params.id);

      res.json({ message: "SubCategory removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
