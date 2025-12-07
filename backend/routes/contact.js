import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Contact form route
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Nodemailer transport setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // <-- App Password use ho raha hai
    },
  });

  try {
    // Email bhejna
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // Apne hi mail pe receive hoga
      subject: `New Help Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(" Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

export default router;
