// Model for Order

const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
  deliveryStatus: String,
  orderRef: String,
  orderDate: String,
  amount: Number,
  order: Array,
  customer: {
    userId: String,
    firstName: String,
    lastName: String,
    email: String,
  },
  delivery: {
    address: String,
    city: String,
    postcode: String,
    country: String,
    state: String,
  },
});

module.exports = Order;
