const db = require("../config/database");

// GET USERS
const getUsers = (req, res) => {
  const sql = "SELECT id, nama, email, role, created_at FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data user",
      });
    }

    res.json(results);
  });
};

// CREATE USER
const createUser = (req, res) => {
  const { nama, email, password, role } = req.body;

  const sql = `
    INSERT INTO users (nama, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nama, email, password, role || "mahasiswa"],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal menambahkan user",
        });
      }

      res.status(201).json({
        message: "User berhasil ditambahkan",
        id: result.insertId,
      });
    }
  );
};

// UPDATE USER
const updateUser = (req, res) => {
  const { id } = req.params;
  const { nama, email, password, role } = req.body;

  const sql = `
    UPDATE users
    SET nama = ?, email = ?, password = ?, role = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nama, email, password, role, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengupdate user",
        });
      }

      res.json({
        message: "User berhasil diupdate",
      });
    }
  );
};

// DELETE USER
const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus user",
      });
    }

    res.json({
      message: "User berhasil dihapus",
    });
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};