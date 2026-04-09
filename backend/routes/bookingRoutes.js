const express = require("express");
const router = express.Router();
const {
  bookFlight,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, bookFlight);
router.get("/my", protect, getUserBookings);
router.get("/detail/:id", protect, getBookingById);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
