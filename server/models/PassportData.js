const mongoose = require("mongoose");

const PassportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Уникальный идентификатор пасспорта
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger",
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  divisionCode: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: String,
    required: true,
  },
});

const Passport = mongoose.model("Passport", PassportSchema);
module.exports = Passport;
