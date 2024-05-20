const User = require("../models/User");
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
}

module.exports = new AdminController();
