const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

function getCurrentUser(req, res) {
  return res.status(200).json({ user: req.user });
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body || {};

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Identifier dan password wajib diisi dengan benar.",
      });
    }

    const loginIdentifier = identifier.trim();
    let [rows] = await db.execute(
      `SELECT id, nama, identifier, email, password_hash, role, is_active
       FROM users
       WHERE identifier = ?
       LIMIT 1`,
      [loginIdentifier],
    );

    if (rows.length === 0) {
      [rows] = await db.execute(
        `SELECT id, nama, identifier, email, password_hash, role, is_active
         FROM users
         WHERE LOWER(email) = ?
         LIMIT 1`,
        [loginIdentifier.toLowerCase()],
      );
    }

    const user = rows[0];
    if (
      !user ||
      !user.password_hash ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        message: "Identifier atau password salah.",
      });
    }

    if (Number(user.is_active) !== 1) {
      return res.status(403).json({ message: "Akun belum aktif." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET belum dikonfigurasi.");
      return res.status(500).json({
        message: "Konfigurasi autentikasi belum tersedia.",
      });
    }

    const role = String(user.role || "").trim().toLowerCase();
    const token = jwt.sign(
      { id: user.id, identifier: user.identifier, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    return res.status(200).json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        identifier: user.identifier,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

module.exports = { getCurrentUser, login };
