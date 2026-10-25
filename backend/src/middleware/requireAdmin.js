function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Autentikasi diperlukan." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin." });
  }

  return next();
}

module.exports = requireAdmin;
