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

router.get(`/orders/:user`, async (req, res) => {
  console.log("Using Route : /orders/:user");
  try {
    const orders = await Order.find();
    const newOrders = [];
    if (orders.findIndex((x) => x.customer.userId === req.params.user) !== -1) {
      newOrders.push(
        orders[
          orders.findIndex((x) => x.customer.userId === req.params.user) !== -1
        ]
      );
      res.status(200).json(newOrders);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
