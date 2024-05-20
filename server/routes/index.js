const Router = require("express");
const router = new Router();
const userRouter = require("./UserRouter");
const ticketRouter = require("./ticketRouter");
const adminRouter = require("./adminRouter");

router.use("/user", userRouter);
router.use("/ticket", ticketRouter);
router.use("/admin", adminRouter);

module.exports = router;
