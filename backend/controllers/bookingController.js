const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

// @desc  Book a flight
// @route POST /api/bookings
const bookFlight = async (req, res) => {
  try {
    const { flightId, passengers, seatClass, contactEmail, contactPhone } =
      req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    const numPassengers = passengers.length;

    // Check seat availability
    if (flight.seats[seatClass] < numPassengers) {
      return res
        .status(400)
        .json({ message: `Not enough ${seatClass} seats available` });
    }

    // Calculate total price
    const totalPrice = flight.price[seatClass] * numPassengers;

    // Reduce available seats
    flight.seats[seatClass] -= numPassengers;
    await flight.save();

    const booking = await Booking.create({
      userId: req.user._id,
      flightId,
      passengers,
      seatClass,
      totalPrice,
      contactEmail,
      contactPhone,
    });

    const populatedBooking = await booking.populate("flightId");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all bookings of logged-in user
// @route GET /api/bookings/:userId
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("flightId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single booking by ID
// @route GET /api/bookings/detail/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("flightId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Security: only owner can view
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Cancel a booking
// @route DELETE /api/bookings/:id
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Restore seats
    const flight = await Flight.findById(booking.flightId);
    if (flight) {
      flight.seats[booking.seatClass] += booking.passengers.length;
      await flight.save();
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookFlight, getUserBookings, getBookingById, cancelBooking };
