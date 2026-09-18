const express = require("express");

const router = express.Router();

const {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.get("/", getBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.put("/:id/status", updateBookingStatus);

module.exports = router;