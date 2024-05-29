const Ticket = require("../models/Ticket");
const Flight = require("../models/Flight");
const ApiError = require("../error/ApiError");

class ticketController {
  async create(req, res, next) {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      departureTime,
      arrivalTime,
      flightNumber,
      serviceClass,
      seatNumber,
      price,
      ticketCount,
    } = req.body;

    if (
      !departureCity ||
      !arrivalCity ||
      !departureDate ||
      !departureTime ||
      !arrivalTime ||
      !flightNumber ||
      !serviceClass ||
      !price ||
      !seatNumber ||
      !ticketCount
    ) {
      return next(ApiError.badRequest("Получены не все данные"));
    }

    try {
      let flight = await Flight.findOne({
        departureCity,
        arrivalCity,
        departureDate,
        departureTime,
        arrivalTime,
        flightNumber,
        serviceClass,
      });

      if (!flight) {
        flight = await Flight.create({
          departureCity,
          arrivalCity,
          departureDate,
          departureTime,
          arrivalTime,
          flightNumber,
          serviceClass,
        });
      }

      const existingTickets = await Ticket.find({
        flightId: flight._id,
        seatNumber: {
          $in: Array.from(
            { length: ticketCount },
            (_, i) => `${seatNumber + i}`
          ),
        },
      });

      if (existingTickets.length > 0) {
        return next(
          ApiError.badRequest(
            "Один или несколько номеров мест уже заняты на этом рейсе"
          )
        );
      }

      const tickets = [];
      for (let i = 0; i < ticketCount; i++) {
        const ticket = await Ticket.create({
          flightId: flight._id,
          price,
          seatNumber: `${seatNumber + i}`,
        });
        tickets.push(ticket);
      }

      res.json({ flight, tickets });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при создании билетов"));
    }
  }

  async getTicketsOfSearch(req, res) {
    const { departureCity, arrivalCity, departureDate, returnDate } = req.query;

    if (!departureCity || !arrivalCity || !departureDate) {
      return res.status(400).json({ error: "Не все данные указаны" });
    }

    try {
      let flightsTo;
      let flightsBack = [];
      let tickets = [];

      flightsTo = await Flight.find({
        departureCity,
        arrivalCity,
        departureDate: new Date(departureDate),
      });

      if (returnDate) {
        flightsBack = await Flight.find({
          departureCity: arrivalCity,
          arrivalCity: departureCity,
          departureDate: new Date(returnDate),
        });
      }

      for (const flight of flightsTo) {
        const ticket = await Ticket.findOne({ flightId: flight._id }).populate({
          path: "flightId",
          select:
            "departureCity arrivalCity departureDate departureTime  arrivalTime serviceClass",
        });
        if (ticket) {
          tickets.push(ticket);
        }
      }

      for (const flight of flightsBack) {
        const ticket = await Ticket.findOne({ flightId: flight._id }).populate({
          path: "flightId",
          select:
            "departureCity arrivalCity departureDate departureTime  arrivalTime serviceClass",
        });
        if (ticket) {
          tickets.push(ticket);
        }
      }

      res.json({ tickets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Произошла ошибка при поиске билетов" });
    }
  }

  async deleteTickets(req, res, next) {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      departureTime,
      arrivalTime,
      flightNumber,
      serviceClass,
      seatNumber,
      price,
    } = req.body;

    try {
      const flight = await Flight.findOne({
        departureCity,
        arrivalCity,
        departureDate,
        departureTime,
        arrivalTime,
        flightNumber,
        serviceClass,
      });

      if (!flight) {
        return next(ApiError.badRequest("Рейс не найден"));
      }

      const ticket = await Ticket.findOneAndDelete({
        flightId: flight._id,
        seatNumber,
        price,
      });

      if (!ticket) {
        return next(ApiError.badRequest("Билет не найден"));
      }

      // Удаление рейса, если больше нет билетов на этот рейс
      const remainingTickets = await Ticket.countDocuments({
        flightId: flight._id,
      });

      if (remainingTickets === 0) {
        await Flight.findByIdAndDelete(flight._id);
      }

      res.json({ message: "Билет успешно удален" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при удалении билета"));
    }
  }

  async dropdownListOfTickets(req, res, next) {
    try {
      const flights = await Flight.find().select(
        "departureCity arrivalCity departureDate departureTime  arrivalTime serviceClass"
      );
      res.json({ flights });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при получении списка рейсов"));
    }
  }

  async getAvailableSeats(req, res, next) {
    const { flightId } = req.query;
    try {
      const availableSeats = await Ticket.find({
        flightId,
        isPurchased: false,
      }).select("seatNumber _id");
      res.json({ seats: availableSeats });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Ошибка при получении мест"));
    }
  }

  async purchaseTicket(req, res, next) {
    const { ticketId } = req.body;
    try {
      console.log("Current User:", req.user._id); // Debug: Log the user object

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return next(ApiError.badRequest("Билет не найден"));
      }
      if (ticket.isPurchased) {
        return next(ApiError.badRequest("Билет уже куплен"));
      }
      const userId = req.user.id;

      ticket.isPurchased = true;
      ticket.userId = userId;

      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          isPurchased: true,
          userId: req.user._id,
        },
        { new: true }
      );
      console.log("Updated Ticket:", updatedTicket); // Debug: Log the updated ticket

      res.json({ message: "Билет успешно куплен" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Ошибка при покупке билета"));
    }
  }

  async getUserTickets(req, res, next) {
    try {
      const userId = req.user._id; // Получаем ID пользователя из токена

      let tickets = await Ticket.find({ userId }).populate({
        path: "flightId",
        select:
          "departureCity arrivalCity departureDate departureTime arrivalTime flightNumber serviceClass",
      });

      if (!tickets || tickets.length === 0) {
        return next(ApiError.badRequest("Билеты не найдены"));
      }

      res.json({ tickets });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Ошибка при получении билетов"));
    }
  }
}

module.exports = new ticketController();
