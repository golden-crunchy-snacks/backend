// Model for Article

const mongoose = require("mongoose");

const Article = mongoose.model("Article", {
  title: String,
  quantity: Number,
  price: Number,
  wholeSalePrice: Number,
  description: String,
  category: String,

  pictures: {
    picture1: String,
    picture2: String,
    picture3: String,
    picture4: String,
  },
  subCategory: String,
});

module.exports = Article;
