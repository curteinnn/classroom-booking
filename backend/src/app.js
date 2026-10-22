const express = require("express");
const db = require("./config/database");
const activationRoutes = require("./routes/activationRoutes");
const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middleware/requireAuth");
const requireAdmin = require("./middleware/requireAdmin");
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");

//bookings
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activation", activationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS database_name");

    res.status(200).json({
      status: "ok",
      message: "SmartClass API is running",
      database: rows[0].database_name,
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.get("/api/admin/test", requireAuth, requireAdmin, (req, res) => {
  res.status(200).json({
    message: "Akses admin berhasil.",
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message:
        "Body JSON tidak valid atau kosong. Untuk GET, kosongkan Body di Postman.",
    });
  }

  console.error("Request error:", err.message);

  return res.status(err.status || 500).json({
    message: "Terjadi kesalahan pada server.",
  });
});

module.exports = app;
