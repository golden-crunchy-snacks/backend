const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const router = express.Router();
const Order = require("../models/Order");

const isValidMail = (mail) => {
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mail.match(mailformat) ? true : false;
};

router.post("/pay", async (req, res) => {
  const {
    amount,
    description,
    orderRef,
    orderDate,
    order,
    firstName,
    lastName,
    email,
    address,
    city,
    postcode,
    country,
    state,
    userId,
  } = req.fields;

  if (!isValidMail(email)) {
    return res.status(400).json({
      error: languages.en.invalidEmail,
    });
  }
  const stripeToken = req.fields.stripeToken;

  const response = await stripe.charges.create({
    amount: amount,
    currency: "gbp",
    description: description,
    source: stripeToken,
  });
  console.log(response.status);

  if (response) {
    const newOrder = new Order({
      amount,
      orderRef,
      orderDate,
      order,
      firstName,
      lastName,
      email,
      address,
      city,
      postcode,
      country,
      state,
      userId,
    });
    newOrder.save();
  }

  res.json(response);
});

module.exports = router;
