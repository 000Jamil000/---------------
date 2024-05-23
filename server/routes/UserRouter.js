const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/newData", authMiddleware, userController.addFullNameAndPassport);
router.get("/auth", authMiddleware, userController.check);
router.get("/getInfoPerson", authMiddleware, userController.getUserProfile);

module.exports = router;
