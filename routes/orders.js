const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get(`/orders`, async (req, res) => {
  console.log("Using Route : /orders");
  console.log(req.query);
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
