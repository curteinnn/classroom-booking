const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendActivationEmail(email, activationUrl) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Aktivasi Akun SmartClass",
    text: [
      "Halo!",
      "",
      "Klik tautan berikut untuk mengaktifkan akun SmartClass",
      "dan membuat password kamu:",
      "",
      activationUrl,
      "",
      "Tautan ini berlaku selama 30 menit dan hanya bisa digunakan sekali.",
      "Jika kamu tidak mengharapkan email ini, abaikan email ini.",
    ].join("\n"),
  });
}

module.exports = { sendActivationEmail };
