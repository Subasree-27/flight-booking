const express = require("express");
const router = express.Router();
const {
  getFlights,
  getFlightById,
  seedFlights,
} = require("../controllers/flightController");

router.get("/", getFlights);
router.get("/:id", getFlightById);
router.post("/seed", seedFlights); // dev only

module.exports = router;
