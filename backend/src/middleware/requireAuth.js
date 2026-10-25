const jwt = require("jsonwebtoken");
const db = require("../config/database");

async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Autentikasi diperlukan.",
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id) {
      return res.status(401).json({
        message: "Token tidak valid.",
      });
    }

    // Periksa status akun terbaru dari database.
    const [rows] = await db.execute(
      `SELECT id, nama, identifier, email, role, is_active
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [payload.id],
    );

    const user = rows[0];

    if (!user || Number(user.is_active) !== 1) {
      return res.status(401).json({
        message: "Akun tidak ditemukan atau sudah nonaktif.",
      });
    }

    req.user = {
      id: user.id,
      nama: user.nama,
      identifier: user.identifier,
      email: user.email,
      role: String(user.role || "").trim().toLowerCase(),
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token tidak valid atau sudah kedaluwarsa.",
      });
    }

    console.error("Authentication failed:", error.message);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
}

module.exports = requireAuth;
