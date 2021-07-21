// Packages
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE, OPTIONS");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  next();
});

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
const ordersRoutes = require("./routes/orders");
app.use(ordersRoutes);

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
