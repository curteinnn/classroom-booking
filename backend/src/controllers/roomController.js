const db = require("../config/database");


// GETROOMM============================
const getRooms = (req, res) => {
  const sql = "SELECT * FROM rooms";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data ruangan",
      });
    }

    res.json(results);
  });
};


//Create ROOOMMMM================================
const createRoom = (req, res) => {
  const { nama_ruangan, kapasitas, lokasi } = req.body;

  const sql = `
    INSERT INTO rooms (nama_ruangan, kapasitas, lokasi)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nama_ruangan, kapasitas, lokasi], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menambahkan ruangan",
      });
    }

    res.status(201).json({
      message: "Ruangan berhasil ditambahkan",
      id: result.insertId,
    });
  });
};

//updateRoom==================
const updateRoom = (req, res) => {
  const { id } = req.params;
  const { nama_ruangan, kapasitas, lokasi } = req.body;

  const sql = `
    UPDATE rooms
    SET nama_ruangan = ?, kapasitas = ?, lokasi = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nama_ruangan, kapasitas, lokasi, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengupdate ruangan",
        });
      }

      res.json({
        message: "Ruangan berhasil diupdate",
      });
    }
  );
};

//DeleteRoommmmm==========================
const deleteRoom = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM rooms WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus ruangan",
      });
    }

    res.json({
      message: "Ruangan berhasil dihapus",
    });
  });
};

module.exports = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
};