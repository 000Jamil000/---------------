const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    departureCity: {
      type: String,
      required: true,
    },
    arrivalCity: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    serviceClass: {
      type: String,
      enum: ["Economy", "Business", "First"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model("Flight", FlightSchema);
module.exports = Flight;
