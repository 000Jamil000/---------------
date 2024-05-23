const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Passenger = mongoose.model("Passenger", PassengerSchema);
module.exports = Passenger;
