const User = require("../models/User");
const Managers = require("../models/Managers");
const ApiError = require("../error/ApiError");

class AdminController {
  // Метод для обновления роли пользователя
  async updateUserRole(req, res, next) {
    const { email, role } = req.body;

    if (!email || !role) {
      return next(ApiError.badRequest("Не все данные указаны"));
    }

    if (!["USER", "ADMIN", "MANAGER"].includes(role)) {
      return next(ApiError.badRequest("Недопустимая роль"));
    }

    try {
      const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true }
      );

      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      res.json({ message: "Роль пользователя обновлена", user });
    } catch (error) {
      console.error(error);
      next(
        ApiError.internal("Произошла ошибка при обновлении роли пользователя")
      );
    }
  }

  async searchUsersByEmail(req, res, next) {
    const { email } = req.query;

    if (!email) {
      return next(ApiError.badRequest("Не указан email для поиска"));
    }

    try {
      const users = await User.find({
        email: { $regex: email, $options: "i" },
      }).select("name email role");

      res.json(users);
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Произошла ошибка при поиске пользователей"));
    }
  }

  async getManagers(req, res, next) {
    try {
      const managers = await User.find({ role: "MANAGER" }).lean();
      const managerDetails = await Managers.find({
        userId: { $in: managers.map((user) => user._id) },
      }).lean();

      const result = managers.map((user) => {
        const managerDetail = managerDetails.find(
          (manager) => manager.userId.toString() === user._id.toString()
        );

        return {
          email: user.email,
          firstName: managerDetail?.firstName || "",
          lastName: managerDetail?.lastName || "",
          middleName: managerDetail?.middleName || "",
        };
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Ошибка при получении менеджеров"));
    }
  }
}

module.exports = new AdminController();
