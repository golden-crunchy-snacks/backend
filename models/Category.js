// Model for Category

const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  title: String,
});

module.exports = Category;
