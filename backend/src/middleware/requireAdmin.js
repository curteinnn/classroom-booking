const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Autentikasi diperlukan.",
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({
        message: "Akses hanya untuk admin.",
      });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      message: "Token autentikasi tidak valid atau kedaluwarsa.",
    });
  }
}

module.exports = requireAdmin;
