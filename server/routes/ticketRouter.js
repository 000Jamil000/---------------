const Router = require("express");
const router = new Router();
const ticketController = require("../controllers/ticketController");
const checkRole = require("../middleware/checkRole");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/newTicket", checkRole("MANAGER"), ticketController.create);

router.delete("/delete", checkRole("MANAGER"), ticketController.deleteTickets);
router.get("/", ticketController.getTicketsOfSearch);
router.get("/getUserTicket", authMiddleware, ticketController.getUserTickets);
router.get("/dropdownList", ticketController.dropdownListOfTickets);
router.get("/seats", authMiddleware, ticketController.getAvailableSeats);
router.post("/purchase", authMiddleware, ticketController.purchaseTicket);

module.exports = router;
