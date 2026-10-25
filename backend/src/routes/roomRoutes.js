const express = require("express");
const db = require("../config/database");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const {
  isValidDate,
  normalizeTime,
  parseCapacity,
} = require("../utils/validation");

const router = express.Router();

// GET /api/admin/rooms
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rooms] = await db.execute(`
      SELECT id, nama_ruangan, kapasitas, lokasi, is_active,
             created_at, updated_at
      FROM rooms
      ORDER BY nama_ruangan ASC
    `);

    return res.status(200).json({
      message: "Daftar ruangan berhasil diambil.",
      total: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil daftar ruangan.",
    });
  }
});

//////////////////////////////////
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { nama_ruangan, kapasitas, lokasi } = req.body || {};
  const parsedCapacity = parseCapacity(kapasitas);

  if (
    typeof nama_ruangan !== "string" ||
    !nama_ruangan.trim() ||
    typeof lokasi !== "string" ||
    !lokasi.trim() ||
    parsedCapacity === null
  ) {
    return res.status(400).json({
      message:
        "Nama ruangan, lokasi, dan kapasitas 1–50 wajib diisi dengan benar.",
    });
  }

  if (nama_ruangan.trim().length > 100 || lokasi.trim().length > 150) {
    return res.status(400).json({
      message: "Nama ruangan maksimal 100 karakter dan lokasi 150 karakter.",
    });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO rooms (nama_ruangan, kapasitas, lokasi, is_active)
       VALUES (?, ?, ?, 1)`,
      [nama_ruangan.trim(), parsedCapacity, lokasi.trim()],
    );

    return res.status(201).json({
      message: "Ruangan berhasil ditambahkan.",
      room: {
        id: result.insertId,
        nama_ruangan: nama_ruangan.trim(),
        kapasitas: parsedCapacity,
        lokasi: lokasi.trim(),
        is_active: 1,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Nama ruangan tersebut sudah digunakan.",
      });
    }

    console.error("Create room failed:", error.message);

    return res.status(500).json({
      message: "Gagal menambahkan ruangan.",
    });
  }
});

/////////////////////////
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { nama_ruangan, kapasitas, lokasi } = req.body || {};
  const parsedCapacity = parseCapacity(kapasitas);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID ruangan tidak valid.",
    });
  }

  if (
    typeof nama_ruangan !== "string" ||
    !nama_ruangan.trim() ||
    typeof lokasi !== "string" ||
    !lokasi.trim() ||
    parsedCapacity === null
  ) {
    return res.status(400).json({
      message:
        "Nama ruangan, lokasi, dan kapasitas 1–50 wajib diisi dengan benar.",
    });
  }

  if (nama_ruangan.trim().length > 100 || lokasi.trim().length > 150) {
    return res.status(400).json({
      message: "Nama ruangan maksimal 100 karakter dan lokasi 150 karakter.",
    });
  }

  try {
    const [result] = await db.execute(
      `UPDATE rooms
       SET nama_ruangan = ?, kapasitas = ?, lokasi = ?
       WHERE id = ?`,
      [nama_ruangan.trim(), parsedCapacity, lokasi.trim(), id],
    );

    if (result.affectedRows === 0) {
      const [rows] = await db.execute("SELECT id FROM rooms WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Ruangan tidak ditemukan.",
        });
      }
    }

    return res.status(200).json({
      message: "Data ruangan berhasil diperbarui.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Nama ruangan tersebut sudah digunakan.",
      });
    }

    console.error("Update room failed:", error.message);

    return res.status(500).json({
      message: "Gagal memperbarui data ruangan.",
    });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const roomId = Number(req.params.id);
  if (!Number.isSafeInteger(roomId) || roomId < 1) {
    return res.status(400).json({ message: "ID ruangan tidak valid." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rooms] = await connection.execute(
      "SELECT id FROM rooms WHERE id = ? FOR UPDATE",
      [roomId],
    );
    if (rooms.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Ruangan tidak ditemukan." });
    }

    const [bookings] = await connection.execute(
      "SELECT id FROM bookings WHERE room_id = ? LIMIT 1",
      [roomId],
    );
    if (bookings.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        message: "Ruangan memiliki riwayat booking. Nonaktifkan ruangan agar riwayat tetap tersimpan.",
      });
    }

    await connection.execute("DELETE FROM rooms WHERE id = ?", [roomId]);
    await connection.commit();
    return res.status(200).json({ message: "Ruangan berhasil dihapus." });
  } catch (error) {
    await connection.rollback();
    console.error("Delete room failed:", error.message);
    return res.status(500).json({ message: "Gagal menghapus ruangan." });
  } finally {
    connection.release();
  }
});

///////////////////////////

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { is_active } = req.body || {};

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID ruangan tidak valid.",
    });
  }

  if (
    is_active !== 0 &&
    is_active !== 1 &&
    is_active !== true &&
    is_active !== false
  ) {
    return res.status(400).json({
      message: "is_active harus bernilai 0 atau 1.",
    });
  }

  const activeStatus = Number(is_active);

  try {
    const [result] = await db.execute(
      `UPDATE rooms
       SET is_active = ?
       WHERE id = ?`,
      [activeStatus, id],
    );

    if (result.affectedRows === 0) {
      const [rows] = await db.execute("SELECT id FROM rooms WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Ruangan tidak ditemukan.",
        });
      }
    }

    return res.status(200).json({
      message:
        activeStatus === 1
          ? "Ruangan berhasil diaktifkan."
          : "Ruangan berhasil dinonaktifkan.",
      room: {
        id,
        is_active: activeStatus,
      },
    });
  } catch (error) {
    console.error("Update room status failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengubah status ruangan.",
    });
  }
});

//////////////schedule
//////////////////////////////
router.get("/:id/schedule", requireAuth, async (req, res) => {
  const roomId = Number(req.params.id);
  const { tanggal } = req.query;

  if (!Number.isSafeInteger(roomId) || roomId < 1) {
    return res.status(400).json({
      message: "ID ruangan tidak valid.",
    });
  }

  if (!isValidDate(tanggal)) {
    return res.status(400).json({
      message: "Parameter tanggal wajib diisi dengan format YYYY-MM-DD.",
    });
  }

  try {
    const [rooms] = await db.execute(
      `SELECT id, nama_ruangan, kapasitas, lokasi, is_active
       FROM rooms
       WHERE id = ?`,
      [roomId],
    );

    if (rooms.length === 0) {
      return res.status(404).json({
        message: "Ruangan tidak ditemukan.",
      });
    }

    const [bookings] = await db.execute(
      `SELECT
         id,
         tanggal,
         jam_mulai,
         jam_selesai,
         status
       FROM bookings
       WHERE room_id = ?
         AND tanggal = ?
         AND status IN ('pending', 'approved')
       ORDER BY jam_mulai ASC`,
      [roomId, tanggal],
    );

    return res.status(200).json({
      message: "Jadwal ruangan berhasil diambil.",
      room: rooms[0],
      tanggal,
      bookings,
    });
  } catch (error) {
    console.error("Get room schedule failed:", error.message);

    return res.status(500).json({
      message: "Gagal mengambil jadwal ruangan.",
    });
  }
});

////////////////////////searchh available////////////////////////
//////////////////////////////////////////////////////////

router.get("/search/available", requireAuth, async (req, res) => {
  const { tanggal, jam_mulai, jam_selesai, kapasitas, lokasi } = req.query;

  if (
    !isValidDate(tanggal) ||
    !normalizeTime(jam_mulai) ||
    !normalizeTime(jam_selesai)
  ) {
    return res.status(400).json({
      message: "Tanggal dan jam wajib diisi dengan format yang benar.",
    });
  }

  const startTime = normalizeTime(jam_mulai);
  const endTime = normalizeTime(jam_selesai);

  if (startTime >= endTime) {
    return res.status(400).json({
      message: "Jam selesai harus lebih besar daripada jam mulai.",
    });
  }

  let minCapacity = 1;

  if (kapasitas !== undefined) {
    minCapacity = Number(kapasitas);

    if (
      !Number.isSafeInteger(minCapacity) ||
      minCapacity < 1 ||
      minCapacity > 50
    ) {
      return res.status(400).json({
        message: "Kapasitas harus berupa angka antara 1 dan 50.",
      });
    }
  }

  try {
    const [dateRows] = await db.execute(`
      SELECT
        DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS today,
        DATE_FORMAT(
          DATE_ADD(CURDATE(), INTERVAL 6 DAY),
          '%Y-%m-%d'
        ) AS max_date,
        TIME_FORMAT(CURTIME(), '%H:%i:%s') AS db_time
    `);

    const { today, max_date: maxDate, db_time: dbTime } = dateRows[0];

    if (tanggal < today || tanggal > maxDate) {
      return res.status(400).json({
        message: "Pencarian hanya bisa dilakukan untuk hari ini sampai H+6.",
      });
    }

    if (tanggal === today && startTime <= dbTime) {
      return res.status(400).json({
        message: "Jam mulai harus lebih besar daripada waktu sekarang.",
      });
    }

    const [rooms] = await db.execute(
      `SELECT
         r.id,
         r.nama_ruangan,
         r.kapasitas,
         r.lokasi
       FROM rooms r
       WHERE r.is_active = 1
         AND r.kapasitas >= ?
         AND (? IS NULL OR r.lokasi = ?)
         AND NOT EXISTS (
           SELECT 1
           FROM bookings b
           WHERE b.room_id = r.id
             AND b.tanggal = ?
             AND b.status IN ('pending', 'approved')
             AND b.jam_mulai < ?
             AND b.jam_selesai > ?
         )
       ORDER BY r.kapasitas ASC, r.nama_ruangan ASC`,
      [
        minCapacity,
        lokasi || null,
        lokasi || null,
        tanggal,
        endTime,
        startTime,
      ],
    );

    return res.status(200).json({
      message: "Pencarian ruangan berhasil.",
      total: rooms.length,
      filters: {
        tanggal,
        jam_mulai: startTime,
        jam_selesai: endTime,
        kapasitas: minCapacity,
      },
      rooms,
    });
  } catch (error) {
    console.error("Search available rooms failed:", error.message);

    return res.status(500).json({
      message: "Gagal mencari ruangan yang tersedia.",
    });
  }
});

///////////////////////////////search berdasarkan nama ruangan///////////
///////////////////////////////////////

router.get("/search", requireAuth, async (req, res) => {
  const { nama_ruangan } = req.query;

  if (typeof nama_ruangan !== "string" || !nama_ruangan.trim()) {
    return res.status(400).json({
      message: "Nama ruangan wajib diisi.",
    });
  }

  try {
    const [rooms] = await db.execute(
      `SELECT id, nama_ruangan, kapasitas, lokasi, is_active
       FROM rooms
       WHERE nama_ruangan LIKE ?
       ORDER BY nama_ruangan ASC
       LIMIT 20`,
      [`%${nama_ruangan.trim()}%`],
    );

    return res.status(200).json({
      message:
        rooms.length > 0
          ? "Ruangan berhasil ditemukan."
          : "Ruangan tidak ditemukan.",
      total: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Search rooms failed:", error.message);

    return res.status(500).json({
      message: "Gagal mencari ruangan.",
    });
  }
});

module.exports = router;
