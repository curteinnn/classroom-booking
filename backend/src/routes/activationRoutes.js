const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../config/database");

const router = express.Router();

router.post("/complete", async (req, res) => {
  const { token, password } = req.body;

  if (
    typeof token !== "string" ||
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 72
  ) {
    return res.status(400).json({
      message:
        "Token atau password tidak valid. Password harus 12–72 karakter.",
    });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [tokens] = await connection.execute(
      `SELECT id, user_id
       FROM account_activation_tokens
       WHERE token_hash = ?
         AND used_at IS NULL
         AND expires_at > NOW()
       LIMIT 1
       FOR UPDATE`,
      [tokenHash],
    );

    if (tokens.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        message: "Token tidak valid, kedaluwarsa, atau sudah digunakan.",
      });
    }

    const activation = tokens[0];

    const [users] = await connection.execute(
      `SELECT id, role, email, password_hash
       FROM users
       WHERE id = ?
       LIMIT 1
       FOR UPDATE`,
      [activation.user_id],
    );

    if (
      users.length === 0 ||
      users[0].role === "admin" ||
      users[0].password_hash !== null ||
      !users[0].email
    ) {
      await connection.rollback();

      return res.status(400).json({
        message: "Akun tidak memenuhi syarat aktivasi.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [updateResult] = await connection.execute(
      `UPDATE users
       SET password_hash = ?,
           email_verified_at = NOW(),
           is_active = 1
       WHERE id = ?
         AND password_hash IS NULL
         AND is_active = 0`,
      [passwordHash, activation.user_id],
    );

    if (updateResult.affectedRows !== 1) {
      await connection.rollback();

      return res.status(400).json({
        message: "Akun sudah diproses atau tidak memenuhi syarat aktivasi.",
      });
    }

    await connection.execute(
      `UPDATE account_activation_tokens
       SET used_at = NOW()
       WHERE id = ?`,
      [activation.id],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Aktivasi berhasil. Kamu sekarang bisa login.",
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Activation failed:", error.message);

    return res.status(500).json({
      message: "Aktivasi gagal karena kesalahan server.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
