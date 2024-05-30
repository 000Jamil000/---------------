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
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model("Flight", FlightSchema);
module.exports = Flight;
