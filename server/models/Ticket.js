const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seatNumber: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["WAITING", "CANCELLED", "BOUGHT"],
      default: "WAITING",
    },
  },
  {
    timestamps: true,
  }
);

TicketSchema.pre("remove", async function (next) {
  await mongoose.model("Flight").findByIdAndDelete(this.flightId);
  next();
});

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
