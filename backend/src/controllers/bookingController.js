const db = require("../config/database");

// GET BOOKINGS
const getBookings = (req, res) => {
  const sql = `
    SELECT
      bookings.id,
      users.nama,
      rooms.nama_ruangan,
      rooms.lokasi,
      bookings.tanggal,
      bookings.jam_mulai,
      bookings.jam_selesai,
      bookings.tujuan,
      bookings.status
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    JOIN rooms ON bookings.room_id = rooms.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data booking",
      });
    }

    res.json(results);
  });
};

// CREATE BOOKING
const createBooking = (req, res) => {
  const {
    user_id,
    room_id,
    tanggal,
    jam_mulai,
    jam_selesai,
    tujuan,
  } = req.body;

  // VALIDASI JAM
  if (jam_selesai <= jam_mulai) {
    return res.status(400).json({
      message: "Jam selesai harus lebih dari jam mulai",
    });
  }

  // CEK BENTROK BOOKING
  const checkSql = `
    SELECT *
    FROM bookings
    WHERE room_id = ?
      AND tanggal = ?
      AND jam_mulai < ?
      AND jam_selesai > ?
      AND status != 'rejected'
  `;

  db.query(
    checkSql,
    [room_id, tanggal, jam_selesai, jam_mulai],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengecek jadwal booking",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Ruangan sudah dibooking pada waktu tersebut",
        });
      }

      // JIKA TIDAK BENTROK, INSERT
      const sql = `
        INSERT INTO bookings
        (user_id, room_id, tanggal, jam_mulai, jam_selesai, tujuan)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          user_id,
          room_id,
          tanggal,
          jam_mulai,
          jam_selesai,
          tujuan,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal membuat booking",
            });
          }

          res.status(201).json({
            message: "Booking berhasil dibuat",
            id: result.insertId,
          });
        }
      );
    }
  );
};

// UPDATE BOOKING
const updateBooking = (req, res) => {
  const { id } = req.params;

  const {
    room_id,
    tanggal,
    jam_mulai,
    jam_selesai,
    tujuan,
  } = req.body;

  if (jam_selesai <= jam_mulai) {
    return res.status(400).json({
      message: "Jam selesai harus lebih dari jam mulai",
    });
  }

  const checkSql = `
    SELECT *
    FROM bookings
    WHERE room_id = ?
      AND tanggal = ?
      AND jam_mulai < ?
      AND jam_selesai > ?
      AND status != 'rejected'
      AND id != ?
  `;

  db.query(
    checkSql,
    [room_id, tanggal, jam_selesai, jam_mulai, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengecek jadwal booking",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Ruangan sudah dibooking pada waktu tersebut",
        });
      }

      const sql = `
        UPDATE bookings
        SET room_id = ?,
            tanggal = ?,
            jam_mulai = ?,
            jam_selesai = ?,
            tujuan = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          room_id,
          tanggal,
          jam_mulai,
          jam_selesai,
          tujuan,
          id,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal mengupdate booking",
            });
          }

          res.json({
            message: "Booking berhasil diupdate",
          });
        }
      );
    }
  );
};

// DELETE BOOKING
const deleteBooking = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM bookings WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus booking",
      });
    }

    res.json({
      message: "Booking berhasil dihapus",
    });
  });
};

// UPDATE STATUS BOOKING
const updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status tidak valid",
    });
  }

  const sql = `
    UPDATE bookings
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengupdate status booking",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Booking tidak ditemukan",
      });
    }

    res.json({
      message: "Status booking berhasil diupdate",
    });
  });
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
};