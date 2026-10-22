const express = require("express");
const db = require("../config/database");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const { createActivation } = require("../services/activationService");

const router = express.Router();

//USERSSSSSSSSSSSSSSS/////////////////////////////////////
////////////////////////////////////////
router.post("/users", requireAuth, requireAdmin, async (req, res) => {
  const { nama, identifier, email, role } = req.body || {};

  if (
    typeof nama !== "string" ||
    typeof identifier !== "string" ||
    typeof email !== "string" ||
    !nama.trim() ||
    !identifier.trim() ||
    !email.trim()
  ) {
    return res.status(400).json({
      message: "Nama, identifier, dan email wajib diisi.",
    });
  }

  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : "";

  if (!["mahasiswa", "dosen"].includes(normalizedRole)) {
    return res.status(400).json({
      message: "Role hanya boleh mahasiswa atau dosen.",
    });
  }

  const normalizedName = nama.trim();
  const normalizedIdentifier = identifier.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedName.length > 100 ||
    normalizedIdentifier.length > 50 ||
    normalizedEmail.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return res.status(400).json({
      message: "Format atau panjang data tidak valid.",
    });
  }

  let userId;

  try {
    const [result] = await db.execute(
      `INSERT INTO users
        (nama, identifier, email, password_hash, role, is_active, email_verified_at)
       VALUES (?, ?, ?, NULL, ?, 0, NULL)`,
      [normalizedName, normalizedIdentifier, normalizedEmail, normalizedRole],
    );

    userId = result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Identifier atau email sudah terdaftar.",
      });
    }

    console.error("Create user failed:", error.message);

    return res.status(500).json({
      message: "Gagal membuat akun.",
    });
  }

  try {
    await createActivation(userId, normalizedEmail);

    return res.status(201).json({
      message: "Akun berhasil dibuat. Email aktivasi telah dikirim.",
      user: {
        id: userId,
        nama: normalizedName,
        identifier: normalizedIdentifier,
        email: normalizedEmail,
        role: normalizedRole,
        is_active: 0,
      },
    });
  } catch (error) {
    console.error("Activation email failed:", error.message);

    return res.status(201).json({
      message:
        "Akun berhasil dibuat, tetapi email aktivasi gagal dikirim. Admin perlu mengirim ulang aktivasi.",
      user: {
        id: userId,
        nama: normalizedName,
        identifier: normalizedIdentifier,
        email: normalizedEmail,
        role: normalizedRole,
        is_active: 0,
      },
      activationEmailSent: false,
    });
  }
});

///gett usersss
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         id,
         nama,
         identifier,
         email,
         role,
         is_active,
         email_verified_at,
         created_at
       FROM users
       ORDER BY created_at DESC`,
    );

    return res.status(200).json({
      message: "Daftar pengguna berhasil diambil.",
      total: rows.length,
      users: rows,
    });
  } catch (error) {
    console.error("Get users failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil daftar pengguna.",
    });
  }
});

//////////////////////////////////////////////////BOOKING KELAS KING///////////////
///////////////////////////////////////////////////////////////////////////
router.get("/bookings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT
        b.id,
        b.tanggal,
        b.jam_mulai,
        b.jam_selesai,
        b.tujuan,
        b.status,
        b.rejection_reason,
        b.created_at,
        u.id AS user_id,
        u.nama AS nama_pemesan,
        u.identifier,
        u.role AS role_pemesan,
        r.id AS room_id,
        r.nama_ruangan,
        r.lokasi,
        r.kapasitas
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN rooms r ON r.id = b.room_id
      ORDER BY
        CASE
          WHEN b.status = 'pending' THEN 0
          ELSE 1
        END,
        b.tanggal ASC,
        b.jam_mulai ASC
    `);

    return res.status(200).json({
      message: "Daftar seluruh booking berhasil diambil.",
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil daftar booking.",
    });
  }
});

////////////////////////ganti status room
router.patch(
  "/bookings/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const bookingId = Number(req.params.id);
    const { status, rejection_reason } = req.body || {};

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
      return res.status(400).json({
        message: "ID booking tidak valid.",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status hanya boleh approved atau rejected.",
      });
    }

    let reason = null;

    if (status === "rejected") {
      if (
        typeof rejection_reason !== "string" ||
        !rejection_reason.trim() ||
        rejection_reason.trim().length > 500
      ) {
        return res.status(400).json({
          message: "Alasan penolakan wajib diisi, maksimal 500 karakter.",
        });
      }

      reason = rejection_reason.trim();
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Cari booking untuk mengetahui ruangan yang perlu dikunci.
      const [initialRows] = await connection.execute(
        `SELECT id, room_id
       FROM bookings
       WHERE id = ?`,
        [bookingId],
      );

      if (initialRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: "Booking tidak ditemukan.",
        });
      }

      const roomId = initialRows[0].room_id;

      // Kunci ruangan agar proses persetujuan tersinkron dengan
      // pengajuan booking baru untuk ruangan yang sama.
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
          message: "Ruangan booking tidak ditemukan.",
        });
      }

      // Periksa ulang status booking setelah memperoleh kunci.
      const [bookingRows] = await connection.execute(
        `SELECT id, room_id, tanggal, jam_mulai, jam_selesai, status
       FROM bookings
       WHERE id = ?
       FOR UPDATE`,
        [bookingId],
      );

      const booking = bookingRows[0];

      if (booking.status !== "pending") {
        await connection.rollback();

        return res.status(409).json({
          message: "Booking sudah diproses dan tidak lagi berstatus pending.",
        });
      }

      if (status === "approved") {
        if (Number(rooms[0].is_active) !== 1) {
          await connection.rollback();

          return res.status(409).json({
            message: "Ruangan nonaktif, booking tidak dapat disetujui.",
          });
        }

        // Periksa ulang konflik sebelum menyetujui.
        const [conflicts] = await connection.execute(
          `SELECT id
         FROM bookings
         WHERE room_id = ?
           AND tanggal = ?
           AND id <> ?
           AND status IN ('pending', 'approved')
           AND jam_mulai < ?
           AND jam_selesai > ?
         LIMIT 1`,
          [
            booking.room_id,
            booking.tanggal,
            bookingId,
            booking.jam_selesai,
            booking.jam_mulai,
          ],
        );

        if (conflicts.length > 0) {
          await connection.rollback();

          return res.status(409).json({
            message: "Booking tidak dapat disetujui karena jadwal bentrok.",
          });
        }
      }

      await connection.execute(
        `UPDATE bookings
       SET status = ?, rejection_reason = ?
       WHERE id = ?`,
        [status, reason, bookingId],
      );

      await connection.commit();

      return res.status(200).json({
        message:
          status === "approved"
            ? "Booking berhasil disetujui."
            : "Booking berhasil ditolak.",
        booking: {
          id: bookingId,
          status,
          rejection_reason: reason,
        },
      });
    } catch (error) {
      await connection.rollback();

      console.error("Update booking status failed:", error.message);

      return res.status(500).json({
        message: "Gagal memproses booking.",
      });
    } finally {
      connection.release();
    }
  },
);

module.exports = router;
