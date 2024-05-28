const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/newData", authMiddleware, userController.addFullNameAndPassport);
router.post(
  "/newDataManager",
  authMiddleware,
  userController.addFullNameAndPost
);
router.post(
  "/newDataAdmin",
  authMiddleware,
  userController.addFullNameAndPostAdmin
);
router.get("/auth", authMiddleware, userController.check);
router.get("/getInfoPerson", authMiddleware, userController.getUserProfile);
router.get("/getInfoManager", authMiddleware, userController.getManagerProfile);
router.get("/getInfoAdmin", authMiddleware, userController.getAdminProfile);

module.exports = router;
