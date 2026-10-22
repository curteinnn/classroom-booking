require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("SMTP host:", process.env.SMTP_HOST);
console.log("SMTP port:", process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    await transporter.verify();
    console.log("SMTP connection successful!");

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: "SmartClass - Tes Email",
      text: "Bang, email SMTP SmartClass berhasil dikirim!",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email test failed!");
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
    console.error("Full error:", error);
  }
}

testEmail();
