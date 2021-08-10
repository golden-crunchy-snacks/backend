const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get(`/articles`, async (req, res) => {
  console.log("Using Route : /articles");
  console.log(req.query);
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get(`/article/:id`, async (req, res) => {
  console.log("Using Route : /article/:id");
  console.log(req.params.id);
  try {
    const article = await Article.findById(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/article/create", async (req, res) => {
  console.log("Using route : /article/create");
  try {
    const picture = req.files.picture.path;
    const { title, quantity, price, description, category, subCategory } =
      req.fields;

    if (title && quantity && price && description && category && picture) {
      const result = await cloudinary.uploader.upload(picture, {
        folder: "/golden-crunchy-snacks",
      });

      const newArticle = new Article({
        title: title,
        quantity: quantity,
        price: price,
        description: description,
        picture: result.url,
        category: category,

        subCategory: subCategory,
      });
      newArticle.save();
      res.status(200).json({
        _id: newArticle._id,
      });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/article/pay", async (req, res) => {
  console.log("route : /article/pay");
  console.log(req.fields);
  try {
    const article = await Article.findById(req.fields.id);

    article.quantity = article.quantity - req.fields.quantity;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/article/update", async (req, res) => {
  console.log("route : /article/update");
  const urlCheck = /^((http|https|ftp):\/\/)/;

  const { id, title, quantity, price, description, category, subCategory } =
    req.fields;
  const picture =
    req.files.picture === undefined
      ? req.fields.picture
      : req.files.picture.path;
  try {
    if (
      id &&
      title &&
      quantity &&
      price &&
      description &&
      category &&
      picture
    ) {
      if (!urlCheck.test(picture)) {
        const result = await cloudinary.uploader.upload(picture, {
          folder: "/golden-crunchy-snacks",
        });
        const article = await Article.findById(id);
        article.title = title;
        article.quantity = quantity;
        article.price = price;
        article.description = description;
        article.category = category;
        article.picture = result.url;
        article.subCategory = subCategory;

        await article.save();
        res.json(article);
        console.log("file");
      } else {
        const article = await Article.findById(id);
        article.title = title;
        article.quantity = quantity;
        article.price = price;
        article.description = description;
        article.category = category;
        article.picture = picture;
        article.subCategory = subCategory;
        await article.save();
        res.json(article);
        console.log("http");
      }
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete("/article/delete/:id", async (req, res) => {
  console.log("route : /article/delete");
  console.log(req.params);
  try {
    if (req.params.id) {
      await Article.findByIdAndDelete(req.params.id);

      res.json({ message: "Article removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
