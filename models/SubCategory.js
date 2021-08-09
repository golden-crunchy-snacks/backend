// Model for SubCategory

const mongoose = require("mongoose");

const SubCategory = mongoose.model("SubCategory", {
  title: String,
  categoryId: String,
});

module.exports = SubCategory;
