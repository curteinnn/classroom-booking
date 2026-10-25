const express = require("express");
const cors = require("cors");
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

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin tidak diizinkan oleh kebijakan CORS.");
      error.status = 403;
      return callback(error);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "32kb" }));

app.use((req, res, next) => {
  console.info("Request:", req.method, req.path);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/activation", activationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      message: "SmartClass API is running",
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
  void next;

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Format JSON tidak valid. Periksa kembali Body request.",
    });
  }

  console.error("Request error:", err.message);

  return res.status(err.status || 500).json({
    message: "Terjadi kesalahan pada server.",
  });
});

module.exports = app;
