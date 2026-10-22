const express = require("express");
const db = require("../config/database");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

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

  if (
    typeof nama_ruangan !== "string" ||
    !nama_ruangan.trim() ||
    typeof lokasi !== "string" ||
    !lokasi.trim() ||
    kapasitas === undefined ||
    kapasitas === null ||
    kapasitas === "" ||
    !Number.isInteger(Number(kapasitas)) ||
    Number(kapasitas) < 1 ||
    Number(kapasitas) > 50
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
      [nama_ruangan.trim(), Number(kapasitas), lokasi.trim()],
    );

    return res.status(201).json({
      message: "Ruangan berhasil ditambahkan.",
      room: {
        id: result.insertId,
        nama_ruangan: nama_ruangan.trim(),
        kapasitas: Number(kapasitas),
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
    kapasitas === undefined ||
    kapasitas === null ||
    kapasitas === "" ||
    !Number.isInteger(Number(kapasitas)) ||
    Number(kapasitas) < 1 ||
    Number(kapasitas) > 50
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
      [nama_ruangan.trim(), Number(kapasitas), lokasi.trim(), id],
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

module.exports = router;
