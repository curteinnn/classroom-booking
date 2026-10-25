const express = require("express");
const db = require("../config/database");
const requireAuth = require("../middleware/requireAuth");
const { isValidDate, normalizeTime } = require("../utils/validation");

const router = express.Router();

// POST /api/bookings
router.post("/", requireAuth, async (req, res) => {
  const { room_id, tanggal, jam_mulai, jam_selesai, tujuan } = req.body || {};

  const roomId = Number(room_id);

  if (!Number.isSafeInteger(roomId) || roomId < 1) {
    return res.status(400).json({
      message: "ID ruangan tidak valid.",
    });
  }

  if (
    !isValidDate(tanggal) ||
    !normalizeTime(jam_mulai) ||
    !normalizeTime(jam_selesai) ||
    typeof tujuan !== "string" ||
    !tujuan.trim() ||
    tujuan.trim().length > 255
  ) {
    return res.status(400).json({
      message:
        "Tanggal, jam mulai, jam selesai, dan tujuan wajib diisi dengan benar.",
    });
  }

  const startTime = normalizeTime(jam_mulai);
  const endTime = normalizeTime(jam_selesai);

  if (startTime >= endTime) {
    return res.status(400).json({
      message: "Jam selesai harus lebih besar daripada jam mulai.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Validasi tanggal menggunakan waktu database.
    const [dateRows] = await connection.execute(`
    SELECT
    CURDATE() AS today,
    DATE_ADD(CURDATE(), INTERVAL 6 DAY) AS max_date,
    CURTIME() AS db_time
    `);

    const { today, max_date: maxDate, db_time: currentTime } = dateRows[0];

    const formatDate = (value) => {
      if (value instanceof Date) {
        return [
          value.getFullYear(),
          String(value.getMonth() + 1).padStart(2, "0"),
          String(value.getDate()).padStart(2, "0"),
        ].join("-");
      }

      return String(value).slice(0, 10);
    };

    const requestedDate = tanggal;
    const todayString = formatDate(today);
    const maxDateString = formatDate(maxDate);

    if (requestedDate < todayString || requestedDate > maxDateString) {
      await connection.rollback();

      return res.status(400).json({
        message: "Booking hanya bisa dilakukan untuk hari ini sampai H+6.",
      });
    }

    if (
      requestedDate === todayString &&
      startTime <= String(currentTime).slice(0, 8)
    ) {
      await connection.rollback();

      return res.status(400).json({
        message: "Jam mulai harus lebih besar daripada waktu sekarang.",
      });
    }

    // Kunci baris ruangan agar booking bersamaan untuk ruangan
    // yang sama diperiksa secara berurutan.
    const [rooms] = await connection.execute(
      `SELECT id, is_active
       FROM rooms
       WHERE id = ?
       FOR UPDATE`,
      [roomId],
    );

    if (rooms.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Ruangan tidak ditemukan.",
      });
    }

    if (Number(rooms[0].is_active) !== 1) {
      await connection.rollback();

      return res.status(400).json({
        message: "Ruangan sedang tidak aktif dan tidak bisa dipesan.",
      });
    }

    // Cek bentrok dengan booking pending maupun approved.
    const [conflicts] = await connection.execute(
      `SELECT id
       FROM bookings
       WHERE room_id = ?
         AND tanggal = ?
         AND status IN ('pending', 'approved')
         AND jam_mulai < ?
         AND jam_selesai > ?
       LIMIT 1`,
      [roomId, requestedDate, endTime, startTime],
    );

    if (conflicts.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message: "Jadwal ruangan bentrok dengan booking yang sudah ada.",
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO bookings
        (user_id, room_id, tanggal, jam_mulai, jam_selesai, tujuan, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, roomId, requestedDate, startTime, endTime, tujuan.trim()],
    );

    await connection.commit();

    return res.status(201).json({
      message: "Booking berhasil diajukan dan menunggu persetujuan admin.",
      booking: {
        id: result.insertId,
        user_id: req.user.id,
        room_id: roomId,
        tanggal: requestedDate,
        jam_mulai: startTime,
        jam_selesai: endTime,
        tujuan: tujuan.trim(),
        status: "pending",
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error("Create booking failed:", error.message);

    return res.status(500).json({
      message: "Gagal membuat booking.",
    });
  } finally {
    connection.release();
  }
});

////
////////////////////getbookingss sendiri

router.get("/my", requireAuth, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT
         b.id,
         b.tanggal,
         b.jam_mulai,
         b.jam_selesai,
         b.tujuan,
         b.status,
         b.rejection_reason,
         r.nama_ruangan,
         r.lokasi,
         r.kapasitas
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       WHERE b.user_id = ?
       ORDER BY b.tanggal DESC, b.jam_mulai DESC`,
      [req.user.id],
    );

    return res.status(200).json({
      message: "Riwayat booking berhasil diambil.",
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil riwayat booking.",
    });
  }
});

////////////////////cancecl bookingsss//////////////////////

router.patch("/:id/cancel", requireAuth, async (req, res) => {
  const bookingId = Number(req.params.id);

  if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
    return res.status(400).json({
      message: "ID booking tidak valid.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Cari booking milik pengguna yang sedang login.
    const [rows] = await connection.execute(
      `SELECT
         id,
         room_id,
         tanggal,
         jam_mulai,
         status
       FROM bookings
       WHERE id = ? AND user_id = ?
       FOR UPDATE`,
      [bookingId, req.user.id],
    );

    if (rows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Booking tidak ditemukan.",
      });
    }

    const booking = rows[0];

    if (!["pending", "approved"].includes(booking.status)) {
      await connection.rollback();

      return res.status(409).json({
        message: "Booking ini tidak dapat dibatalkan.",
        status: booking.status,
      });
    }

    // Cek waktu saat ini berdasarkan tanggal dan waktu database.
    const [timeRows] = await connection.execute(`
      SELECT
        CURDATE() AS today,
        CURTIME() AS db_time
    `);

    const today = String(timeRows[0].today).slice(0, 10);
    const now = String(timeRows[0].db_time).slice(0, 8);

    const bookingDate =
      booking.tanggal instanceof Date
        ? [
            booking.tanggal.getFullYear(),
            String(booking.tanggal.getMonth() + 1).padStart(2, "0"),
            String(booking.tanggal.getDate()).padStart(2, "0"),
          ].join("-")
        : String(booking.tanggal).slice(0, 10);

    const startTime = String(booking.jam_mulai).slice(0, 8);

    if (bookingDate < today || (bookingDate === today && now >= startTime)) {
      await connection.rollback();

      return res.status(409).json({
        message: "Booking tidak dapat dibatalkan setelah jadwal dimulai.",
      });
    }

    await connection.execute(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = ? AND user_id = ?`,
      [bookingId, req.user.id],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Booking berhasil dibatalkan.",
      booking: {
        id: bookingId,
        status: "cancelled",
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error("Cancel booking failed:", error.message);

    return res.status(500).json({
      message: "Gagal membatalkan booking.",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
