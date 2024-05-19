const express = require("express");
const mongoose = require("mongoose");
const router = require("./server/routes/UserRouter");
const createUser = require("./server/routes/UserRouter");
const Passenger = require("./server/models/Passenger");
const Flight = require("./server/models/Flight");
const Ticket = require("./server/models/Ticket");
const Booking = require("./server/models/Booking");
const User = require("./server/models/User");
const Passport = require("./server/models/PassportData");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(createUser);

app.use("/api", router);

// app.use(express.static(path.join("client")));

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
