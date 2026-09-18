const express = require("express");
const cors = require("cors");

const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); //MIDDLEWARE buat akses izin

app.get("/", (req, res) => {
  res.send("Backend classroom booking jalan!");
});

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});