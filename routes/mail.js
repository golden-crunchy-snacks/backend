const express = require("express");
const router = express.Router();
const languages = require("../lang/errorMessages.json");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

router.post(`/mail/order`, async (req, res) => {
  console.log("Using Route : /mail/order");
  const { to, orderRef, firstName, lastName } = req.fields;

  try {
    const data = {
      from: "Golden Crunchy Snacks <goldencrunchysnacks.hf@gmail.com>",
      to: to,
      subject: `Your Golden Crunchy Snacks order ${orderRef}`,
      text: `
      Dear ${firstName} ${lastName},
      
      This is an automated email to confirm your recent order with Golden Crunchy Snacks.

      Your order reference is : ${orderRef} .
      
      If you have any questions or would like to get in touch, please contact us at https://golden-crunchy-snacks.netlify.app/contact
      
      Best,
      
      Our team at Golden Crunchy Snacks`,
    };
    await mailgun.messages().send(data, (error, body) => {
      res.status(200).json("Email sent!");
      console.log(body);
    });
    res.json;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post(`/mail/contact`, async (req, res) => {
  const isValidMail = (mail) => {
    const mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return mail.match(mailformat) ? true : false;
  };
  console.log("Using Route : /mail/contact");
  const { from, subject, orderRef, firstName, lastName, text } = req.fields;

  if (!from || !subject || !firstName || !lastName || !text) {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }
  if (!isValidMail(from)) {
    return res.status(400).json({
      error: languages.en.invalidEmail,
    });
  }

  try {
    const data = {
      from: `${firstName} ${lastName} <${from}>`,
      to: "Golden Crunchy Snacks <goldencrunchysnacks.hf@gmail.com>",
      subject: `${orderRef} : ${subject}`,
      text: text,
    };
    await mailgun.messages().send(data, (error, body) => {
      if (body) {
        res.status(200).json("Email sent!");
        console.log(body);
      } else {
        res.status(400).json({ error: error.message });
      }
    });
    res.json;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
