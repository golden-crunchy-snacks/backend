// Packages
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const cors = require("cors");
app.use(cors());

// Database configuration

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Routes
const articlesRoutes = require("./routes/articles");
app.use(articlesRoutes);
const categoriesRoutes = require("./routes/categories");
app.use(categoriesRoutes);
const usersRoutes = require("./routes/users");
app.use(usersRoutes);
const payRoutes = require("./routes/pay");
app.use(payRoutes);

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
