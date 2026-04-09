const Flight = require("../models/Flight");

// @desc  Get all flights with optional filters
// @route GET /api/flights
const getFlights = async (req, res) => {
  try {
    const { from, to, date, seatClass } = req.query;
    let query = {};

    if (from) query["from.code"] = from.toUpperCase();
    if (to) query["to.code"] = to.toUpperCase();

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: start, $lte: end };
    }

    let flights = await Flight.find(query).sort({ departureTime: 1 });

    // Filter by available seats
    if (seatClass) {
      flights = flights.filter((f) => f.seats[seatClass] > 0);
    }

    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single flight
// @route GET /api/flights/:id
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Seed sample flights (dev only)
// @route POST /api/flights/seed
const seedFlights = async (req, res) => {
  try {
    await Flight.deleteMany({});

    const sampleFlights = [
      {
        flightNumber: "AI101",
        airline: "Air India",
        from: { city: "Delhi", code: "DEL" },
        to: { city: "Mumbai", code: "BOM" },
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        duration: "2h 00m",
        price: { economy: 4500, business: 12000 },
        seats: { economy: 120, business: 18 },
      },
      {
        flightNumber: "6E202",
        airline: "IndiGo",
        from: { city: "Delhi", code: "DEL" },
        to: { city: "Mumbai", code: "BOM" },
        departureTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
        duration: "2h 05m",
        price: { economy: 3800, business: 10000 },
        seats: { economy: 150, business: 10 },
      },
      {
        flightNumber: "SG303",
        airline: "SpiceJet",
        from: { city: "Mumbai", code: "BOM" },
        to: { city: "Bangalore", code: "BLR" },
        departureTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000),
        duration: "1h 30m",
        price: { economy: 3200, business: 8500 },
        seats: { economy: 100, business: 8 },
      },
      {
        flightNumber: "AI404",
        airline: "Air India",
        from: { city: "Chennai", code: "MAA" },
        to: { city: "Delhi", code: "DEL" },
        departureTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 8.5 * 60 * 60 * 1000),
        duration: "2h 30m",
        price: { economy: 5200, business: 14000 },
        seats: { economy: 130, business: 20 },
      },
      {
        flightNumber: "UK505",
        airline: "Vistara",
        from: { city: "Bangalore", code: "BLR" },
        to: { city: "Hyderabad", code: "HYD" },
        departureTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 5.25 * 60 * 60 * 1000),
        duration: "1h 15m",
        price: { economy: 2800, business: 7500 },
        seats: { economy: 90, business: 12 },
      },
      {
        flightNumber: "6E606",
        airline: "IndiGo",
        from: { city: "Mumbai", code: "BOM" },
        to: { city: "Chennai", code: "MAA" },
        departureTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 9.5 * 60 * 60 * 1000),
        duration: "1h 30m",
        price: { economy: 3500, business: 9000 },
        seats: { economy: 140, business: 16 },
      },
    ];

    const flights = await Flight.insertMany(sampleFlights);
    res.status(201).json({ message: "Flights seeded!", count: flights.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFlights, getFlightById, seedFlights };
