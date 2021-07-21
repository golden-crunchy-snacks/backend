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
    const { title, quantity, price, description, category } = req.fields;

    const result = await cloudinary.uploader.upload(req.files.picture, {
      folder: "/golden-crunchy-snacks",
    });

    const newArticle = new Article({
      title: title,
      quantity: quantity,
      price: price,
      description: description,
      picture: result.url,
      category: category,
    });
    newArticle.save();
    res.status(200).json({
      _id: newArticle._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/article/pay", async (req, res) => {
  console.log("route : /article/pay");
  console.log(req.fields);
  try {
    if (req.fields.id && req.fields.quantity) {
      const article = await Article.findById(req.fields.id);
      if (article.quantity >= req.fields.quantity) {
        article.quantity = article.quantity - req.fields.quantity;
        await article.save();
        res.json(article);
      } else {
        res.status(400).json({
          message:
            "The quantity that you've selected surpasses the stock capacity",
        });
      }
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/article/update", async (req, res) => {
  console.log("route : /article/update");
  console.log(req.files.picture);
  const { id, title, quantity, price, description, category } = req.fields;
  try {
    if (id && title && quantity && price && description && category) {
      const result = await cloudinary.uploader.upload(req.files.picture, {
        folder: "/golden-crunchy-snacks",
      });
      console.log(result);

      const article = await Article.findById(id);
      article.title = title;
      article.quantity = quantity;
      article.price = price;
      article.description = description;
      article.category = category;
      article.picture = result.url;
      await article.save();
      res.json(article);
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/article/delete", async (req, res) => {
  try {
    if (req.fields.id) {
      await Article.findByIdAndDelete(req.fields.id);

      res.json({ message: "Article removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
