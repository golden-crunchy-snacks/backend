const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middlewares/isAuthenticated");
const languages = require("../lang/errorMessages.json");
const User = require("../models/User");

const isValidMail = (mail) => {
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mail.match(mailformat) ? true : false;
};

router.post("/users/signup", formidable(), async (req, res) => {
  const { email, password } = req.fields;
  if (!email || !password) {
    return res.status(400).json({
      error: languages.en.incomplete,
    });
  } else if (!isValidMail(email)) {
    return res.status(400).json({
      error: languages.en.invalidEmail,
    });
  }

  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  const token = uid2(32);

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({
      error: languages.en.emailTaken,
    });
  }

  try {
    const newUser = await new User({
      email,
      token,
      hash,
      salt,
    });

    await newUser.save();
    res.status(200).json({
      id: newUser._id,
      token: newUser.token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.post("/users/login", formidable(), async (req, res) => {
  const { email, password } = req.fields;

  if (!email || !password) {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }
  if (!isValidMail(email)) {
    return res.status(400).json({
      error: languages.en.invalidEmail,
    });
  }
  let user = await User.findOne({ email });
  if (!user) {
    user = {
      salt: null,
      password: null,
    };
  }
  const hash = SHA256(password + user.salt).toString(encBase64);
  if (hash === user.hash) {
    return res.status(200).json({
      _id: user._id,
      token: user.token,
    });
  } else {
    return res.status(401).json({
      error: languages.en.wrongInput,
    });
  }
});

router.get("/user/account", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, "email account");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Erreur inconnue" });
  }
});

module.exports = router;
