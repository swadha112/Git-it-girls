const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email sending logic
router.post('/send-email', async (req, res) => {
  const { supplierEmail, productName, quantity, shipmentPort } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: supplierEmail,
    subject: `Reorder Request for ${productName}`,
    text: `Hello, we would like to reorder ${quantity} units of ${productName} to be shipped to ${shipmentPort}.`,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
