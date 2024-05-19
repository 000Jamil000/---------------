const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const Passenger = require("./models/Passenger");
const Flight = require("./models/Flight");
const Ticket = require("./models/Ticket");
const Booking = require("./models/Booking");
const User = require("./models/User");
const Passport = require("./models/PassportData");
const Profile = require("./models/Profile");
const path = require("path");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(path.join("client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "HTML", "index.html"));
});
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect("mongodb://localhost:27017/GoodBye");
    console.log("Успешно подключено к MongoDB");
    app.listen(PORT, () => {
      console.log(`Сервер запустился на ${PORT} порту`);
    });
  } catch (err) {
    console.error("Ошибка подключения к MongoDB:", err);
  }
}

start();
