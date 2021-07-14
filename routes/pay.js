const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const router = express.Router();

router.post("/pay", async (req, res) => {
  const { amount, description } = req.fields;
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

  // TODO
  // Sauvegarder la transaction dans une BDD MongoDB

  res.json(response);
});

module.exports = router;
