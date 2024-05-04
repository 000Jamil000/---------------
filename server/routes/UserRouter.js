const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.post("/post", userController.hui);

module.exports = router;
