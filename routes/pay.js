const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const router = express.Router();
const Order = require("../models/Order");

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

  // Réception du token créer via l'API Stripe depuis le Frontend
  const stripeToken = req.fields.stripeToken;
  // Créer la transaction
  const response = await stripe.charges.create({
    amount: amount,
    currency: "gbp",
    description: description,
    // On envoie ici le token
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
