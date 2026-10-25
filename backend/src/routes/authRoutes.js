const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getCurrentUser, login } = require("../controllers/authController");

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.post("/login", login);

module.exports = router;
