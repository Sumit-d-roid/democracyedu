// Use ESM import (project is type: module). Provide ambient declaration elsewhere.
import express from 'express';

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Configure nodemailer with Gmail SMTP
  // Dynamically import nodemailer to avoid static type requirements
  // @ts-ignore - ambient declaration provided; suppress if unresolved
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.default.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'sumitacharya9841@gmail.com',
    subject: `New Feedback from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

export default router;
