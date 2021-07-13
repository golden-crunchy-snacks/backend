// Packages
const express = require("express");
const app = express();
require("dotenv").config();

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
