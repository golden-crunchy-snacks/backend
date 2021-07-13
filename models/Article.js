// Model for Article

const mongoose = require("mongoose");

const Article = mongoose.model("Article", {
  title: String,
  quantity: Number,
  price: Number,
  description: String,
  picture: String,
});

module.exports = Article;
