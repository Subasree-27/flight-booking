const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: true,
    },
    from: {
      city: { type: String, required: true },
      code: { type: String, required: true }, // IATA code e.g. DEL, BOM
    },
    to: {
      city: { type: String, required: true },
      code: { type: String, required: true },
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String, // e.g. "2h 30m"
    },
    price: {
      economy: { type: Number, required: true },
      business: { type: Number, required: true },
    },
    seats: {
      economy: { type: Number, default: 150 },
      business: { type: Number, default: 20 },
    },
    status: {
      type: String,
      enum: ["On Time", "Delayed", "Cancelled"],
      default: "On Time",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);
