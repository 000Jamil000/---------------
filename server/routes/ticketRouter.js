const Router = require("express");
const router = new Router();
const ticketController = require("../controllers/ticketController");
const checkRole = require("../middleware/checkRole");

router.post("/newTicket", checkRole("MANAGER"), ticketController.create);
router.delete("/delete", checkRole("MANAGER"), ticketController.deleteTickets);
router.get("/", ticketController.getTicketsOfSearch);
router.get("/dropdownList", ticketController.dropdownListOfTickets);

module.exports = router;
