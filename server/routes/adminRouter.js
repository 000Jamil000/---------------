const Router = require("express");
const router = new Router();
const adminController = require("../controllers/adminController");
const checkRole = require("../middleware/checkRole");

router.post("/updateRole", checkRole("ADMIN"), adminController.updateUserRole);
router.get("/searchUsers", adminController.searchUsersByEmail);
router.get("/getStuff", adminController.getManagers);

module.exports = router;
